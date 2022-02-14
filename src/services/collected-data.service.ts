import { FieldRepository } from './../repository/field.repository';
import { getConnection } from 'typeorm';
import { CollectedDataRepository } from '../repository/collected-data.repository';
import { CollectDataDto } from '../validators/collected-data';
import { ValidationError } from 'class-validator';
import { FieldService } from './field.service';

export class CollectedDataService {
  private collectedDataRepository: CollectedDataRepository;
  private fieldService: FieldService;
  constructor() {
    this.collectedDataRepository = getConnection().getCustomRepository(
      CollectedDataRepository
    );
    this.fieldService = new FieldService();
  }

  // Have not implement the pagination
  public getListByFormId = async (formId: number) => {
    return this.collectedDataRepository.find({ where: { formId } });
  };

  public createBulk = async (data: CollectDataDto[]) => {
    await this.validateFormIds(data);
    const result = await this.collectedDataRepository.save(data);
    return result;
  };

  private validateFormIds = async (data: CollectDataDto[]) => {
    const totalFoundFields = await this.fieldService.countByIds(
      data.map((d) => d.fieldId)
    );
    if (totalFoundFields !== data.length) {
      throw new ValidationError();
    }
  };
}
