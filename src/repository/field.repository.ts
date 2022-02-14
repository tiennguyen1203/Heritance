import { EntityRepository, Repository } from 'typeorm';
import { FieldEntity } from '../database/entities/field.entity';

@EntityRepository(FieldEntity)
export class FieldRepository extends Repository<FieldEntity> {}
