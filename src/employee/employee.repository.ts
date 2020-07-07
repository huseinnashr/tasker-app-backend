import { EntityRepository } from 'typeorm';
import { Employee } from './employee.entity';
import { AppRepository } from '../core/app.entity';

@EntityRepository(Employee)
export class EmployeeRepository extends AppRepository<Employee> {
  constructor() {
    super('Employee');
  }
}
