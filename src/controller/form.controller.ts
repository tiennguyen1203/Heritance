import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response } from 'express';
import { ApiOperationGet, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { BadRequestError, NotFoundError } from '../errors';
import { collectedDataService } from '../services/collected-data.service';
import { fieldService } from '../services/field.service';
import { formService } from '../services/form.service';
import { CreateFormDto } from '../validators/forms';
import { CollectDataDto } from './../validators/collected-data/index';

@ApiPath({
  path: '/api/v1/forms',
  name: 'Form',
})
export class FormController {
  @ApiOperationPost({
    description: 'Create a new form',
    parameters: {
      body: {
        description: 'Create form payload',
        required: true,
        model: 'CreateFormDto',
      },
    },
    responses: {
      201: { description: 'Success', model: 'FormEntity' },
    },
  })
  public async create(req: Request, res: Response) {
    let createFormDto: CreateFormDto;
    try {
      createFormDto = (await transformAndValidate(
        CreateFormDto,
        req.body
      )) as CreateFormDto;
    } catch (error) {
      console.error('Error when validate create form payload', error);
      throw new BadRequestError('Validation error');
    }

    console.log('createFormDto:', createFormDto);
    const newForm = await formService.createForm(createFormDto);
    return res.status(201).send(newForm);
  }

  // TODO: Implement the pagination
  public async getList(req: Request, res: Response) {
    const forms = await formService.getList();
    res.send(forms).json();
  }

  @ApiOperationGet({
    description: 'Get form details',
    parameters: {
      path: {
        id: {
          required: true,
          name: 'formId',
        },
      },
    },
    path: '/:id',
    responses: {
      200: { description: 'Success', model: 'FormDetails' },
    },
  })
  public async getFormDetails(req: Request, res: Response) {
    const formDetails = await formService.getFormDetails(+req.params.id);
    if (!formDetails) {
      return res.status(404).send({ message: 'Form not found' });
    }
    res.send(formDetails).json();
  }

  @ApiOperationPost({
    description: 'Collect data',
    parameters: {
      path: {
        id: {
          required: true,
          name: 'formId',
        },
      },
      body: {
        description: 'collect form data payload',
        required: true,
        model: 'CollectDataDto',
      },
    },
    path: '/:id/collect',
    responses: {
      200: { description: 'Success', model: 'CollectDataSuccess' },
    },
  })
  public async collectData(req: Request, res: Response) {
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
  }

  @ApiOperationGet({
    description: 'get Collected data of form',
    parameters: {
      path: {
        id: {
          required: true,
          name: 'formId',
        },
      },
    },
    path: '/:id/collected-data',
    responses: {
      200: {
        description: 'Success',
        model: 'CollectedDataEntity',
        type: 'array',
      },
    },
  })
  public async getCollectedDataById(req: Request, res: Response) {
    const formId = +req.params.id;
    const form = await formService.getById(formId);
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // TODO: Implement the pagination
    const result = await collectedDataService.getListByFormId(formId);

    return res.status(200).send(result);
  }
}
