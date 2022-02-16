import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FieldEntity } from './field.entity';

@ApiModel({
  description: 'FormEntity',
  name: 'FormEntity',
})
@Entity('forms')
export class FormEntity {
  @ApiModelProperty({
    description: 'Form Id',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({
    description: 'Form Name',
    example: 'Form 1',
  })
  @Column()
  name: string;

  @ApiModelProperty({
    description: 'Form Name',
    model: 'FieldEntity',
  })
  @OneToMany(() => FieldEntity, (field) => field.form)
  fields: FieldEntity[];
}
