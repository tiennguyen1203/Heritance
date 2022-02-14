import { EntityRepository, Repository } from 'typeorm';
import { FormEntity } from '../database/entities/form.entity';

@EntityRepository(FormEntity)
export class FormRepository extends Repository<FormEntity> {}
