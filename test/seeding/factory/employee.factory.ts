import * as Faker from 'faker';
import { EmployeeEntity } from '../../../src/database/entity';
import { Role } from '../../../src/database/enum';
import { Factory } from '../core';

interface EmployeeParam {
  username?: string;
  role?: Role;
  password?: string;
}

export class EmployeeFactory extends Factory<EmployeeEntity, EmployeeParam> {
  private counter = 0;

  protected get(param: Partial<EmployeeParam>): EmployeeEntity {
    const { username, role, password } = param;
    this.counter += 1;

    const employee = new EmployeeEntity();
    employee.firstName = Faker.name.firstName();
    employee.lastName = Faker.name.lastName();

    employee.username =
      username ||
      Faker.internet.userName(employee.firstName, employee.lastName) +
        this.counter;

    employee.role =
      role || Faker.random.arrayElement([Role.MANAGER, Role.STAFF]);

    employee.email =
      this.counter +
      Faker.internet.email(employee.firstName, employee.lastName);

    const profilePictures = ['pp1.jpg', 'pp2.jpg', 'pp3.jpg'];
    employee.profilePicture = Faker.random.arrayElement(profilePictures);

    employee.password = password ?? 'password';

    return employee;
  }
}
