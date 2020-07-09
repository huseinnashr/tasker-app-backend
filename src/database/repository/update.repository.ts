import { EntityRepository } from 'typeorm';
import { Update } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Update)
export class UpdateRepository extends AppRepository<Update> {
  constructor() {
    super('Update');
  }
}
