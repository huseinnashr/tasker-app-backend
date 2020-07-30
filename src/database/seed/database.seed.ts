import { AppSeeder } from '../../core/app.seeder';
import { Connection } from 'typeorm';
import { EmployeeFactory } from '../factory';
import { Role } from '../enum';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../repository';
import { ProjectFactory } from '../factory/project.factory';
import { TaskFactory } from '../factory/task.factory';

export class DatabaseSeed extends AppSeeder {
  protected async _run(c: Connection): Promise<void> {
    const empFactory = new EmployeeFactory();

    const admin = empFactory.makeOne({
      username: 'admin',
      role: Role.ADMIN,
    });
    const managers = empFactory.makeMany(3, { role: Role.MANAGER });
    const staffs = empFactory.makeMany(10, { role: Role.STAFF });

    const empRepo = c.getCustomRepository(EmployeeRepository);
    await empRepo.save(admin);
    await empRepo.save(managers);
    await empRepo.save(staffs);

    const proFactory = new ProjectFactory();
    const projects = proFactory.makeMany(10, { managerPool: managers });

    const proRepo = c.getCustomRepository(ProjectRepository);
    await proRepo.save(projects);

    const taskFactory = new TaskFactory();
    const tasks = taskFactory.makeMany(40, {
      projectPool: projects,
      staffPool: staffs,
    });

    const taskRepo = c.getCustomRepository(TaskRepository);
    await taskRepo.save(tasks);
  }
}
