import { INestApplication } from '@nestjs/common';
import {
  ProjectRepository,
  TaskRepository,
} from '../../src/database/repository';
import { Employee, Project, Task } from '../../src/database/entity';
import { ProjectStatus, TaskStatus } from '../../src/database/enum';

class RepoHelper {
  private proRepo: ProjectRepository;
  private taskRepo: TaskRepository;

  constructor(app: INestApplication) {
    this.proRepo = app.get(ProjectRepository);
    this.taskRepo = app.get(TaskRepository);
  }

  async createAProject(manager: Employee): Promise<Project> {
    return await this.proRepo.save(
      this.proRepo.create({
        title: 'Project',
        body: 'project body',
        status: ProjectStatus.IN_PROGRESS,
        manager: manager,
      }),
    );
  }

  async createATask(project: Project, staff: Employee): Promise<Task> {
    return await this.taskRepo.save(
      this.taskRepo.create({
        title: 'Task',
        body: 'task body',
        status: TaskStatus.IN_PROGRESS,
        project: project,
        staff: staff,
      }),
    );
  }
}

export { RepoHelper };
