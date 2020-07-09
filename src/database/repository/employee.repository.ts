import { EntityRepository } from 'typeorm';
import { Employee } from '../entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Employee)
export class EmployeeRepository extends AppRepository<Employee> {
  constructor() {
    super('Employee');
  }
}
