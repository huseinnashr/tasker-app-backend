import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtifactRepository, TaskRepository } from '../database/repository';
import { AppService } from '../core/app.service';
import { ArtifactEntity, EmployeeEntity } from '../database/entity';
import { CreateArtifactDTO, UpdateArtifactDTO } from './dto';
import { TaskArtifactParamDTO, ProjectTaskParamDTO } from '../shared/dto';

@Injectable()
export class TaskArtifactService extends AppService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepo: TaskRepository,
    @InjectRepository(ArtifactRepository)
    private artifactRepo: ArtifactRepository,
  ) {
    super();
  }

  async getAll(param: ProjectTaskParamDTO): Promise<ArtifactEntity[]> {
    const task = await this.taskRepo.findOneOrException(param.taskId);
    return this.artifactRepo.find({ where: { task } });
  }

  async create(
    param: ProjectTaskParamDTO,
    createDto: CreateArtifactDTO,
    employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    const task = await this.taskRepo.findOneOrException(param.taskId, {
      relations: ['project'],
    });
    this.canManage(task.project.isManager(employee), "task's entities");

    const artifact = new ArtifactEntity();

    artifact.description = createDto.description;
    artifact.task = task;

    return this.artifactRepo.save(artifact);
  }

  async update(
    param: TaskArtifactParamDTO,
    updateDto: UpdateArtifactDTO,
    employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      artifact.task.project.isManager(employee),
      "task's artifact",
    );

    artifact.description = updateDto.description;

    return this.artifactRepo.save(artifact);
  }

  async delete(
    param: TaskArtifactParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.artifactId, task: { id: param.taskId } };
    const option = { relations: ['task', 'task.project'] };
    const artifact = await this.artifactRepo.findOneOrException(where, option);

    this.canManage(
      artifact.task.project.isManager(employee),
      "task's artifact",
    );

    await this.artifactRepo.delete(artifact);
  }
}
