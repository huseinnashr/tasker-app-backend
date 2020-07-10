import { INestApplication } from '@nestjs/common';
import {
  ProjectRepository,
  TaskRepository,
  UpdateRepository,
  CommentRepository,
} from '../../src/database/repository';
import {
  Employee,
  Project,
  Task,
  Update,
  Comment,
} from '../../src/database/entity';
import {
  ProjectStatus,
  TaskStatus,
  UpdateType,
  Role,
} from '../../src/database/enum';
import { AuthHelper } from './auth.helper';

class RepoHelper {
  private proRepo: ProjectRepository;
  private taskRepo: TaskRepository;
  private updateRepo: UpdateRepository;
  private commRepo: CommentRepository;
  private auth: AuthHelper;

  constructor(app: INestApplication, auth: AuthHelper) {
    this.proRepo = app.get(ProjectRepository);
    this.taskRepo = app.get(TaskRepository);
    this.updateRepo = app.get(UpdateRepository);
    this.commRepo = app.get(CommentRepository);
    this.auth = auth;
  }

  async createAProject(manager?: Employee): Promise<Project> {
    if (!manager) manager = (await this.auth.signUp({ role: Role.MANAGER }))[1];
    return await this.proRepo.save(
      this.proRepo.create({
        title: 'Project',
        body: 'project body',
        status: ProjectStatus.IN_PROGRESS,
        manager: manager,
      }),
    );
  }

  async createATask(project?: Project, staff?: Employee): Promise<Task> {
    if (!project) project = await this.createAProject();
    if (!staff) staff = (await this.auth.signUp({ role: Role.STAFF }))[1];
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

  async createAnUpdate(task?: Task): Promise<Update> {
    if (!task) task = await this.createATask();
    return await this.updateRepo.save(
      this.updateRepo.create({
        title: 'New Task Update',
        body: 'update body',
        type: UpdateType.PROGRESS,
        task: task,
      }),
    );
  }

  async createAComment(update?: Update, creator?: Employee): Promise<Comment> {
    if (!update) update = await this.createAnUpdate();
    if (!creator) creator = update.task.staff;
    return await this.commRepo.save(
      this.commRepo.create({
        body: 'comment body',
        update: update,
        creator: creator,
      }),
    );
  }
}

export { RepoHelper };
