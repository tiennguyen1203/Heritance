import { Connection, getConnection } from 'typeorm';
import { FormRepository } from '../repository/form.repository';
import { FormEntity } from '../database/entities/form.entity';
import { FieldEntity, FieldType } from '../database/entities/field.entity';
import { CreateFormDto } from '../validators/forms';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'FormDetailsField',
})
class Field {
  @ApiModelProperty({
    description: 'Field Id',
    example: 1,
  })
  id: number;

  @ApiModelProperty({
    description: 'field name',
    example: 'userName',
  })
  name: string;

  @ApiModelProperty({
    description: 'field type',
    example: 'text',
    enum: [FieldType.TEXT, FieldType.NUMBER],
  })
  type: FieldType;

  @ApiModelProperty({
    description: 'specify if field is required',
    example: true,
  })
  isRequired: boolean;
}

@ApiModel({
  description: 'Get form details response',
  name: 'FormDetails',
})
export class FormDetails {
  @ApiModelProperty({
    description: 'Form Id',
    example: 1,
  })
  id: number;

  @ApiModelProperty({
    description: 'Form name',
    example: 'Form 1',
  })
  name: string;

  @ApiModelProperty({
    description: 'Form fields',
    model: 'FormDetailsField',
  })
  fields: Field[];
}

class FormService {
  // Have not implement the pagination
  public getList = async () => {
    return getConnection().getCustomRepository(FormRepository).find();
  };

  public getById = async (id: number) => {
    return getConnection().getCustomRepository(FormRepository).findOne(id);
  };

  public createForm = async (createFormDto: CreateFormDto) => {
    console.log('createFormDto:', createFormDto);
    return await getConnection().transaction(
      async (transactionalEntityManager) => {
        const form = new FormEntity();
        form.name = createFormDto.name;
        await transactionalEntityManager.save(form);

        const bulkInsertFields = createFormDto.fields.map((field) => {
          const newField = new FieldEntity();
          newField.isRequired = field.isRequired;
          newField.formId = form.id;
          newField.name = field.name;
          newField.type = field.type;
          return newField;
        });
        await transactionalEntityManager.save(bulkInsertFields);

        return form;
      }
    );
  };

  public getFormDetails(id: number) {
    return getConnection()
      .getCustomRepository(FormRepository)
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.fields', 'field')
      .where('form.id = :id', { id })
      .select([
        'form.id',
        'form.name',
        'field.id',
        'field.name',
        'field.type',
        'field.isRequired',
      ])
      .getOne();
  }
}

export const formService = new FormService();
