import { AppSeeder } from '../../core/app.seeder';
import { Connection } from 'typeorm';
import {
  EmployeeFactory,
  ProjectFactory,
  TaskFactory,
  ArtifactFactory,
  UpdateFactory,
  FileFactory,
} from '../factory';
import { Role, UpdateType } from '../enum';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
  ArtifactRepository,
  UpdateRepository,
  FileRepository,
} from '../repository';
import { fileAttrs } from '../../../test/file';

export class DatabaseSeed extends AppSeeder {
  protected async _run(c: Connection): Promise<void> {
    const empFactory = new EmployeeFactory();
    const proFactory = new ProjectFactory();
    const taskFactory = new TaskFactory();
    const artifactFactory = new ArtifactFactory();
    const updateFactory = new UpdateFactory();
    const fileFactory = new FileFactory();

    const empRepo = c.getCustomRepository(EmployeeRepository);
    const proRepo = c.getCustomRepository(ProjectRepository);
    const taskRepo = c.getCustomRepository(TaskRepository);
    const artifactRepo = c.getCustomRepository(ArtifactRepository);
    const updateRepo = c.getCustomRepository(UpdateRepository);
    const fileRepo = c.getCustomRepository(FileRepository);

    const admin = empFactory.makeOne({
      username: 'admin',
      role: Role.ADMIN,
    });
    await empRepo.save(admin);

    const managers = empFactory.makeMany(3, { role: Role.MANAGER });
    await empRepo.save(managers);

    const staffs = empFactory.makeMany(10, { role: Role.STAFF });
    await empRepo.save(staffs);

    const projects = proFactory.makeMany(10, { managerPool: managers });
    await proRepo.save(projects);

    const tasks = taskFactory.makeMany(40, {
      projectPool: projects,
      staffPool: staffs,
    });
    await taskRepo.save(tasks);

    const artifacts = artifactFactory.makeMany(60, {
      taskPool: tasks,
    });
    await artifactRepo.save(artifacts);

    const updates = updateFactory.makeMany(100, { taskPool: tasks });
    await updateRepo.save(updates);

    const progresses = updates.filter(u => u.type == UpdateType.PROGRESS);

    const files = fileFactory.makeMany(120, {
      updatePool: progresses,
      fileAttrPool: fileAttrs,
    });
    await fileRepo.save(files);
  }
}
