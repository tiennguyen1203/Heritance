import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('collected_data')
export class CollectedDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldId: number;

  @Column('text', { array: true })
  data: string[];
}
