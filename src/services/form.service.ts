import { Connection, getConnection } from 'typeorm';
import { FormRepository } from '../repository/form.repository';
import { FormEntity } from '../database/entities/form.entity';
import { FieldEntity } from '../database/entities/field.entity';
import { CreateFormDto } from '../validators/forms';

export class FormService {
  private formRepository: FormRepository;
  private connection: Connection;

  constructor() {
    this.connection = getConnection();
    this.formRepository = getConnection().getCustomRepository(FormRepository);
  }

  // Have not implement the pagination
  public getList = async () => {
    return this.formRepository.find();
  };

  public getById = async (id: number) => {
    return this.formRepository.findOne(id);
  };

  public createForm = async (createFormDto: CreateFormDto) => {
    return await this.connection.transaction(
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
}
