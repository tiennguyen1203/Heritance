import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FormEntity } from './form.entity';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
}

@ApiModel({
  description: 'Field of form',
  name: 'FieldEntity',
})
@Entity('fields')
export class FieldEntity {
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
    example: 'userName',
  })
  @Column()
  name: string;

  @ApiModelProperty({
    example: 'text',
  })
  @Column({ type: 'enum', enum: FieldType, nullable: true })
  type: FieldType;

  @ApiModelProperty({
    example: true,
  })
  @Column({ default: true })
  isRequired: boolean;

  @ManyToOne(() => FormEntity, (form) => form.fields)
  form: FormEntity;
}
