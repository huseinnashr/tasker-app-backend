import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from '../task/task.repository';
import { Task } from '../task/task.entity';
import { ProjectRepository } from '../project/project.repository';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
  ) {}

  async getAll(projectId: number): Promise<Task[]> {
    const project = await this.proRepo.findOneOrException(projectId);
    return this.taskRepo.find({ where: { project } });
  }

  async get(projectId: number, taskId: number): Promise<Task> {
    return this.taskRepo.findOneOrException({
      id: taskId,
      project: { id: projectId },
    });
  }
}
