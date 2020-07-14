import { INestApplication } from '@nestjs/common';
import {
  ProjectRepository,
  TaskRepository,
  UpdateRepository,
  CommentRepository,
  FileRepository,
} from '../../src/database/repository';
import {
  EmployeeEntity,
  ProjectEntity,
  TaskEntity,
  UpdateEntity,
  CommentEntity,
  FileEntity,
} from '../../src/database/entity';
import {
  ProjectStatus,
  TaskStatus,
  UpdateType,
  Role,
  MimeType,
} from '../../src/database/enum';
import { AuthHelper } from './auth.helper';

class RepoHelper {
  private proRepo: ProjectRepository;
  private taskRepo: TaskRepository;
  private updateRepo: UpdateRepository;
  private commRepo: CommentRepository;
  private fileRepo: FileRepository;
  private auth: AuthHelper;

  constructor(app: INestApplication, auth: AuthHelper) {
    this.proRepo = app.get(ProjectRepository);
    this.taskRepo = app.get(TaskRepository);
    this.updateRepo = app.get(UpdateRepository);
    this.commRepo = app.get(CommentRepository);
    this.fileRepo = app.get(FileRepository);
    this.auth = auth;
  }

  async createAProject(manager?: EmployeeEntity): Promise<ProjectEntity> {
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

  async createATask(
    project?: ProjectEntity,
    staff?: EmployeeEntity,
  ): Promise<TaskEntity> {
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

  async createAnUpdate(
    task?: TaskEntity,
    files?: FileEntity[],
  ): Promise<UpdateEntity> {
    if (!task) task = await this.createATask();
    return await this.updateRepo.save(
      this.updateRepo.create({
        title: 'New Task Update',
        body: 'update body',
        type: UpdateType.PROGRESS,
        task: task,
        files: files ? files : [],
      }),
    );
  }

  async createAComment(
    update?: UpdateEntity,
    creator?: EmployeeEntity,
  ): Promise<CommentEntity> {
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

  async createAFile(
    owner?: EmployeeEntity,
    filepath?: string,
  ): Promise<FileEntity> {
    if (!owner) owner = (await this.auth.signUp({ role: Role.STAFF }))[1];
    return await this.fileRepo.save(
      this.fileRepo.create({
        mime: MimeType.JPEG,
        filename: 'test.jpeg',
        filepath: filepath ? filepath : '\\upload\\231ase34wda',
        owner,
      }),
    );
  }
}

export { RepoHelper };
