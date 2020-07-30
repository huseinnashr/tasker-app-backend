import * as Faker from 'faker';
import { EmployeeEntity } from '../../../src/database/entity';
import { Role } from '../../../src/database/enum';
import { Factory } from '../core';

interface EmployeeParam {
  username?: string;
  role?: Role;
}

export class EmployeeFactory extends Factory<EmployeeEntity, EmployeeParam> {
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
