import { CollectDataDto } from '../validators/collected-data';
import { CollectedDataEntity } from './../database/entities/collected-data.entity';
import { FieldEntity } from './../database/entities/field.entity';

class CollectedDataMapper {
  public toCollectedData({
    formId,
    data,
    fields,
  }: {
    formId: number;
    data: CollectDataDto[];
    fields: FieldEntity[];
  }): Omit<CollectedDataEntity, 'id'> {
    return {
      data: data.map((collectedData) => {
        const foundField = this.getFieldById(collectedData.fieldId, fields);
        return {
          fieldId: collectedData.fieldId,
          fieldName: foundField?.name!,
          type: foundField?.type!,
          value: collectedData.data,
        };
      }),
      formId,
    };
  }

  private getFieldById(
    fieldId: number,
    fields: FieldEntity[]
  ): FieldEntity | undefined {
    const field = fields.find((field) => field.id === fieldId);
    return field;
  }
}

export const collectedDataMapper = new CollectedDataMapper();
