import { CollectDataDto } from './../validators/collected-data/index';
import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response, Router } from 'express';
import { FieldService } from '../services/field.service';
import { FormService } from '../services/form.service';
import { CreateFormDto } from '../validators/forms';
import { CollectedDataService } from '../services/collected-data.service';

export class FormController {
  public router: Router;
  private formService: FormService;
  private fieldService: FieldService;
  private collectedDataService: CollectedDataService;

  constructor() {
    this.formService = new FormService();
    this.fieldService = new FieldService();
    this.collectedDataService = new CollectedDataService();
    this.router = Router();
    this.routes();
  }

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
      return res.status(400).send(error.map((e: any) => e.constraints));
    }

    const newForm = await this.formService.createForm(createFormDto);
    res.status(201).send(newForm);
  };

  public getList = async (req: Request, res: Response) => {
    const forms = await this.formService.getList();
    res.send(forms).json();
  };

  // Have not implement the pagination
  public getListFieldsByFormId = async (req: Request, res: Response) => {
    const forms = await this.fieldService.getListByFormId(+req.params.id);
    res.send(forms).json();
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
    const form = await this.formService.getById(+req.params.id);
    if (!form) {
      // TODO: Implement Error handling
      return res.status(404).send({ message: 'Form not found' });
    }

    const totalRequiredFields = await this.fieldService.countByFormId(form.id, {
      isRequired: true,
    });
    if (totalRequiredFields !== data.length) {
      // TODO: Implement Error handling
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // TODO: Implement the logic to validate the formIds are belong to the same form

    // Can publish message to a queue/topic to handle async here to guarantee scalable
    await this.collectedDataService.createBulk(data);
    return res.status(200).send({ message: 'Data collected successfully' });
  };

  /**
   * Configure the routes of controller
   */
  public routes() {
    this.router.get('/', this.getList);
    this.router.post('/', this.create);
    this.router.get('/:id/fields', this.getListFieldsByFormId);
    this.router.post('/:id/collect', this.collectData);
  }
}
