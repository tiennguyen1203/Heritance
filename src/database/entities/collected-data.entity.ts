import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { FieldType } from './field.entity';

type CollectedDataJson = {
  fieldId: number;
  fieldName: string;
  type: FieldType;
  value: string[];
};

@Entity('collected_data')
export class CollectedDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  formId: number;

  @Column('jsonb')
  data: Array<CollectedDataJson>;
}
