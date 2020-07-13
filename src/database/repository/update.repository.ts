import { EntityRepository } from 'typeorm';
import { UpdateEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(UpdateEntity)
export class UpdateRepository extends AppRepository<UpdateEntity> {
  constructor() {
    super('Update');
  }
}
