import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../errors';
import { collectedDataService } from '../services/collected-data.service';
import { fieldService } from '../services/field.service';
import { formService } from '../services/form.service';
import { CreateFormDto } from '../validators/forms';
import { CollectDataDto } from './../validators/collected-data/index';

export class FormController {
  public create = async (req: Request, res: Response) => {
    const createFormDto: CreateFormDto = req.body;
    const newForm = await formService.createForm(createFormDto);
    return res.status(201).send(newForm);
  };

  // TODO: Implement the pagination
  public getList = async (req: Request, res: Response) => {
    const forms = await formService.getList();
    res.send(forms).json();
  };

  public getFormDetails = async (req: Request, res: Response) => {
    const formDetails = await formService.getFormDetails(+req.params.id);
    if (!formDetails) {
      return res.status(404).send({ message: 'Form not found' });
    }
    res.send(formDetails).json();
  };

  public collectData = async (req: Request, res: Response) => {
    // TODO: Custom logger instead of console.log
    console.log('Collecting data with payload:', req.body);
    const data: CollectDataDto[] = req.body;

    const formId = +req.params.id;
    const form = await formService.getById(formId);
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // SCALABILITY: Can use redis/mem-cache to cache list requiredFields of form
    const requiredFields = await fieldService.getRequiredFieldsByFormId(
      form.id
    );
    const collectedDataFieldIds = data.map((d) => d.fieldId);
    if (
      !requiredFields.every((field) => collectedDataFieldIds.includes(field.id))
    ) {
      throw new BadRequestError('Missing required fields');
    }

    // SCALABILITY: Can publish message to a queue/topic to handle async here to guarantee scalable
    await collectedDataService.collectData(formId, data);
    return res.status(201).send({ message: 'Data collected successfully' });
  };

  public getCollectedDataById = async (req: Request, res: Response) => {
    const formId = +req.params.id;
    const form = await formService.getById(formId);
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // TODO: Implement the pagination
    const result = await collectedDataService.getListByFormId(formId);

    return res.status(200).send(result);
  };
}
