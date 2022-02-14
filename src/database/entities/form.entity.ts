import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('forms')
export class FormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
