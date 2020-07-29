import { AppSeeder } from '../../core/app.seeder';
import { Connection } from 'typeorm';
import { EmployeeFactory } from '../factory';
import { Role } from '../enum';
import { EmployeeRepository } from '../repository';

export class DatabaseSeed extends AppSeeder {
  protected async _run(c: Connection): Promise<void> {
    const empRepo = c.getCustomRepository(EmployeeRepository);

    const admFactory = new EmployeeFactory({ role: Role.ADMIN });
    const admin = admFactory.makeOne();
    await empRepo.save(admin);

    const empFactory = new EmployeeFactory();
    const employees = empFactory.makeMany(10);
    await empRepo.save(employees);
  }
}
