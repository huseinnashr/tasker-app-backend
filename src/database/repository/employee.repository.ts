import { EntityRepository } from 'typeorm';
import { EmployeeEntity } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(EmployeeEntity)
export class EmployeeRepository extends AppRepository<EmployeeEntity> {
  constructor() {
    super('Employee');
  }
}
