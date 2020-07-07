import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from '../task/task.repository';
import { Task } from '../task/task.entity';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
  ) {}

  async getAll(projectId: number): Promise<Task[]> {
    return this.taskRepo.find({ where: { project: { id: projectId } } });
  }

  async get(projectId: number, taskId: number): Promise<Task> {
    return this.taskRepo.findOne({ id: taskId });
  }
}
