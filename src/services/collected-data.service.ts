import { ValidationError } from 'class-validator';
import { getConnection } from 'typeorm';
import { collectedDataMapper } from '../mapper/collected-data.mapper';
import { CollectedDataRepository } from '../repository/collected-data.repository';
import { CollectDataDto } from '../validators/collected-data';
import { fieldService } from './field.service';

class CollectedDataService {
  // Have not implement the pagination
  public getListByFormId = async (formId: number) => {
    return getConnection()
      .getCustomRepository(CollectedDataRepository)
      .find({ where: { formId } });
  };

  public collectData = async (formId: number, data: CollectDataDto[]) => {
    const fields = await this.validateFormIds(formId, data);
    const result = await getConnection()
      .getCustomRepository(CollectedDataRepository)
      .save(collectedDataMapper.toCollectedData({ formId, data, fields }));
    return result;
  };

  private validateFormIds = async (formId: number, data: CollectDataDto[]) => {
    const foundFields = await fieldService.getFieldsByIds(
      data.map((d) => d.fieldId)
    );
    console.log('foundFields:', foundFields);

    if (foundFields.length !== data.length) {
      // TODO: Implement the error handling
      throw new ValidationError();
    }

    const totalBelongToFormFields = await fieldService.countByFormId(formId);
    if (totalBelongToFormFields !== data.length) {
      // TODO: Implement the error handling
      throw new ValidationError();
    }

    return foundFields;
  };
}

export const collectedDataService = new CollectedDataService();
