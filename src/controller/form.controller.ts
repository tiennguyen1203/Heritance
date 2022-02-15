import { CollectDataDto } from './../validators/collected-data/index';
import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response, Router } from 'express';
import { fieldService } from '../services/field.service';
import { formService } from '../services/form.service';
import { CreateFormDto } from '../validators/forms';
import { collectedDataService } from '../services/collected-data.service';

export class FormController {
  public create = async (req: Request, res: Response) => {
    let createFormDto: CreateFormDto;
    try {
      createFormDto = (await transformAndValidate(
        CreateFormDto,
        req.body
      )) as CreateFormDto;
    } catch (error: any) {
      console.error(
        'Error when transform and validate CreateFormDto: ',
        JSON.stringify(error, null, 2)
      );
      // TODO: Implement the class-validator error handling
      return res.status(400).send(error.map((e: any) => e.constraints));
    }

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
      // TODO: Implement the error handling
      return res.status(404).send({ message: 'Form not found' });
    }
    res.send(formDetails).json();
  };

  public collectData = async (req: Request, res: Response) => {
    let data: CollectDataDto[];
    try {
      data = (await transformAndValidate(
        CollectDataDto,
        req.body
      )) as CollectDataDto[];
    } catch (error) {
      console.error(
        'Error when transform and validate CollectDataDto: ',
        JSON.stringify(error, null, 2)
      );
      throw error;
    }

    const formId = +req.params.id;
    const form = await formService.getById(formId);
    if (!form) {
      // TODO: Implement Error handling
      return res.status(404).send({ message: 'Form not found' });
    }

    const totalRequiredFields = await fieldService.countByFormId(form.id, {
      isRequired: true,
    });
    if (totalRequiredFields > data.length) {
      // TODO: Implement Error handling
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Can publish message to a queue/topic to handle async here to guarantee scalable
    await collectedDataService.collectData(formId, data);
    return res.status(201).send({ message: 'Data collected successfully' });
  };

  public getCollectedDataById = async (req: Request, res: Response) => {
    const formId = +req.params.id;
    const form = await formService.getById(formId);
    if (!form) {
      // TODO: Implement error handling to handle 4xx error
      return res.status(404).send({ message: 'Form not found' });
    }

    // TODO: Implement the pagination
    const result = await collectedDataService.getListByFormId(formId);

    return res.status(200).send(result);
  };
}
