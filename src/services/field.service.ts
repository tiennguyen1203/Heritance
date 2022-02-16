import { getConnection } from 'typeorm';
import { FieldRepository } from '../repository/field.repository';

class FieldService {
  public getFieldsByIds = async (ids: number[]) => {
    const query = `id IN (${ids})`;
    return getConnection()
      .getCustomRepository(FieldRepository)
      .find({ where: query });
  };

  public countByFormId = async (
    formId: number,
    condition: Record<string, any> = {}
  ) => {
    return getConnection()
      .getCustomRepository(FieldRepository)
      .count({ where: { ...condition, formId } });
  };

  public getRequiredFieldsByFormId = async (formId: number) => {
    return getConnection()
      .getCustomRepository(FieldRepository)
      .find({ where: { formId, isRequired: true } });
  };
}

export const fieldService = new FieldService();
