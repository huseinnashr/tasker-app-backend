import { AppSeeder } from '../../core/app.seeder';
import { Connection } from 'typeorm';
import {
  EmployeeFactory,
  ProjectFactory,
  TaskFactory,
  ArtifactFactory,
  UpdateFactory,
} from '../factory';
import { Role } from '../enum';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
  ArtifactRepository,
  UpdateRepository,
} from '../repository';

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

    const artifactFactory = new ArtifactFactory();
    const artifacts = artifactFactory.makeMany(60, {
      taskPool: tasks,
    });

    const artifactRepo = c.getCustomRepository(ArtifactRepository);
    await artifactRepo.save(artifacts);

    const updateFactory = new UpdateFactory();
    const updates = updateFactory.makeMany(100, { taskPool: tasks });

    const updateRepo = c.getCustomRepository(UpdateRepository);
    await updateRepo.save(updates);
  }
}
