import * as Faker from 'faker';
import { EmployeeEntity } from '../entity';
import { Role } from '../enum';
import { AppFactory } from '../../core/app.factory';

interface EmployeeTemplate {
  role: Role;
}

export class EmployeeFactory extends AppFactory<
  EmployeeEntity,
  EmployeeTemplate
> {
  protected get(template: Partial<EmployeeTemplate>): EmployeeEntity {
    const { role } = template;

    const employee = new EmployeeEntity();
    employee.username = Faker.internet.userName();
    employee.role =
      role || Faker.random.arrayElement([Role.MANAGER, Role.STAFF]);
    employee.password = 'password';

    return employee;
  }
}
