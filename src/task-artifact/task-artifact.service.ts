import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArtifactRepository,
  TaskRepository,
  UpdateRepository,
} from '../database/repository';
import { AppService } from '../core/app.service';
import { ArtifactEntity, EmployeeEntity } from '../database/entity';
import {
  CreateArtifactDTO,
  UpdateArtifactDTO,
  AssignUpdateDTO,
  TaskArtifactListDTO,
  TaskArtifactListEntityDTO,
  ArtifactUpdateEntityDTO,
} from './dto';
import { TaskArtifactParamDTO, ProjectTaskParamDTO } from '../shared/dto';
import { ArtifactPermission } from '../shared/permission';

@Injectable()
export class TaskArtifactService extends AppService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepo: TaskRepository,
    @InjectRepository(ArtifactRepository)
    private artifactRepo: ArtifactRepository,
    @InjectRepository(UpdateRepository)
    private updateRepo: UpdateRepository,
    private artifactPermission: ArtifactPermission,
  ) {
    super();
  }

  async getAll(
    param: ProjectTaskParamDTO,
    employee: EmployeeEntity,
  ): Promise<TaskArtifactListDTO> {
    const where = param.taskId;
    const options = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(where, options);

    const artifacts = await this.artifactRepo.find({ where: { task } });

    return this.transform(TaskArtifactListDTO, {
      data: artifacts,
      permission: this.artifactPermission.getList(task, employee),
    });
  }

  async create(
    param: ProjectTaskParamDTO,
    createDto: CreateArtifactDTO,
    employee: EmployeeEntity,
  ): Promise<TaskArtifactListEntityDTO> {
    const where = param.taskId;
    const options = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(where, options);

    this.canManage(
      this.artifactPermission.create(task, employee),
      "task's entities",
    );

    const artifact = new ArtifactEntity();

    artifact.description = createDto.description;
    artifact.task = task;
    artifact.update = null;

    await this.artifactRepo.save(artifact);

    return this.transform(TaskArtifactListEntityDTO, {
      data: artifact,
    });
  }

  async update(
    param: TaskArtifactParamDTO,
    updateDto: UpdateArtifactDTO,
    employee: EmployeeEntity,
  ): Promise<TaskArtifactListEntityDTO> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      this.artifactPermission.update(artifact, employee),
      "task's artifact",
    );

    artifact.description = updateDto.description;

    await this.artifactRepo.save(artifact);

    return this.transform(TaskArtifactListEntityDTO, {
      data: artifact,
    });
  }

  async delete(
    param: TaskArtifactParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      this.artifactPermission.delete(artifact, employee),
      "task's artifact",
    );

    await this.artifactRepo.remove(artifact);
  }

  async assignUpdate(
    param: TaskArtifactParamDTO,
    assignDto: AssignUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<ArtifactUpdateEntityDTO> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      this.artifactPermission.update(artifact, employee),
      "artifact's update",
    );

    const update = await this.updateRepo.findOne(assignDto.updateId);

    artifact.update = update;
    this.existOrUnprocessable(update, 'Update');
    await this.artifactRepo.save(artifact);

    return this.transform(ArtifactUpdateEntityDTO, { data: update });
  }

  async removeUpdate(
    param: TaskArtifactParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      this.artifactPermission.update(artifact, employee),
      "artifact's update",
    );

    artifact.update = null;
    await this.artifactRepo.save(artifact);
  }
}
