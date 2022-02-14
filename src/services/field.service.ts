import { getConnection } from 'typeorm';
import { FieldRepository } from '../repository/field.repository';

export class FieldService {
  private fieldRepository: FieldRepository;
  // private connection: Connection;

  constructor() {
    // this.connection = getConnection();
    this.fieldRepository = getConnection().getCustomRepository(FieldRepository);
  }

  // Have not implement the pagination
  public getListByFormId = async (formId: number) => {
    return this.fieldRepository.find({ where: { formId } });
  };

  public countByIds = async (ids: number[]) => {
    const query = `id IN (${ids})`;
    return this.fieldRepository.count({ where: query });
  };

  public countByFormId = async (
    formId: number,
    condition: Record<string, any> = {}
  ) => {
    return this.fieldRepository.count({ where: { ...condition, formId } });
  };
}
