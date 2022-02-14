import { EntityRepository, Repository } from 'typeorm';
import { CollectedDataEntity } from '../database/entities/collected-data.entity';

@EntityRepository(CollectedDataEntity)
export class CollectedDataRepository extends Repository<CollectedDataEntity> {}
