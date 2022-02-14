import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
}

@Entity('fields')
export class FieldEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  formId: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: FieldType, nullable: true })
  type: FieldType;

  @Column({ default: true })
  isRequired: boolean;
}
