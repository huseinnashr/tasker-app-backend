import { EntityRepository } from 'typeorm';
import { Employee } from '../../employee/employee.entity';
import { AppRepository } from '../../core/app.repository';

@EntityRepository(Employee)
export class EmployeeRepository extends AppRepository<Employee> {
  constructor() {
    super('Employee');
  }
}
