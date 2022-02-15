import { Connection, getConnection } from 'typeorm';
import { FormRepository } from '../repository/form.repository';
import { FormEntity } from '../database/entities/form.entity';
import { FieldEntity } from '../database/entities/field.entity';
import { CreateFormDto } from '../validators/forms';

class FormService {
  // Have not implement the pagination
  public getList = async () => {
    return getConnection().getCustomRepository(FormRepository).find();
  };

  public getById = async (id: number) => {
    return getConnection().getCustomRepository(FormRepository).findOne(id);
  };

  public createForm = async (createFormDto: CreateFormDto) => {
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
