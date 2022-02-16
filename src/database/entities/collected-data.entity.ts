import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { FieldType } from './field.entity';

@ApiModel({
  name: 'CollectedDataJson',
})
class CollectedDataJson {
  @ApiModelProperty({
    example: 1,
  })
  fieldId: number;

  @ApiModelProperty({
    example: 'userName',
  })
  fieldName: string;

  @ApiModelProperty({
    description: 'field type',
    example: 'text',
    enum: [FieldType.NUMBER, FieldType.TEXT],
  })
  type: FieldType;

  @ApiModelProperty({
    description: 'value of field that user input',
    example: ['tiennguyen17t2@gmail.com or something else'],
  })
  value: string[];
}

@ApiModel({
  description: 'Data collected from a form',
  name: 'CollectedDataEntity',
})
@Entity('collected_data')
export class CollectedDataEntity {
  @ApiModelProperty({
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({
    example: 1,
  })
  @Column()
  formId: number;

  @ApiModelProperty({
    model: 'CollectedDataJson',
    example: [
      {
        type: 'text',
        value: ['Test data'],
        fieldId: 1,
        fieldName: 'userName',
      },
      {
        type: 'text',
        value: ['Test data'],
        fieldId: 2,
        fieldName: 'email',
      },
    ],
  })
  @Column('jsonb')
  data: Array<CollectedDataJson>;
}
