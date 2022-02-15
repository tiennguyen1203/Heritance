import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FieldEntity } from './field.entity';

@Entity('forms')
export class FormEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => FieldEntity, (field) => field.form)
  fields: FieldEntity[];
}
