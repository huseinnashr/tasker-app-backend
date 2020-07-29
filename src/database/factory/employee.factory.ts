import * as Faker from 'faker';
import { EmployeeEntity } from '../entity';
import { Role } from '../enum';
import { AppFactory } from '../../core/app.factory';

interface EmployeeParam {
  username?: string;
  role?: Role;
}

export class EmployeeFactory extends AppFactory<EmployeeEntity, EmployeeParam> {
  protected get(param: Partial<EmployeeParam>): EmployeeEntity {
    const { username, role } = param;

    const employee = new EmployeeEntity();
    employee.username = username || Faker.internet.userName();
    employee.role =
      role || Faker.random.arrayElement([Role.MANAGER, Role.STAFF]);
    employee.password = 'password';

    return employee;
  }
}
