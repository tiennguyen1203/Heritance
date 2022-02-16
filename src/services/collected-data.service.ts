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
    const fields = await fieldService.getFieldsByIds(
      data.map((d) => d.fieldId)
    );
    const result = await getConnection()
      .getCustomRepository(CollectedDataRepository)
      .save(collectedDataMapper.toCollectedData({ formId, data, fields }));
    return result;
  };
}

export const collectedDataService = new CollectedDataService();
