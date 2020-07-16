import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtifactRepository, TaskRepository } from '../database/repository';
import { AppService } from '../core/app.service';
import { ArtifactEntity, EmployeeEntity } from '../database/entity';
import { CreateArtifactDTO } from './dto';

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

  async create(
    taskId: number,
    createDto: CreateArtifactDTO,
    employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    const task = await this.taskRepo.findOneOrException(taskId, {
      relations: ['project'],
    });
    this.canManage(task.project.isManager(employee), "task's entities");

    const artifact = new ArtifactEntity();

    artifact.description = createDto.description;
    artifact.task = task;

    return this.artifactRepo.save(artifact);
  }
}
