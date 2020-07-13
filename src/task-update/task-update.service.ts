import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { TaskRepository, UpdateRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEntity, EmployeeEntity } from '../database/entity';
import { CreateUpdateDTO, UpdateUpdateDTO } from './dto';

@Injectable()
export class TaskUpdateService extends AppService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
  ) {
    super();
  }

  async getAll(taskId: number): Promise<UpdateEntity[]> {
    const task = await this.taskRepo.findOneOrException(taskId);
    return this.updateRepo.find({ where: { task } });
  }

  async create(
    taskId: number,
    createDto: CreateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateEntity> {
    const task = await this.taskRepo.findOneOrException(taskId);

    this.canManage(task.isStaff(employee), 'Task');

    const update = new UpdateEntity();
    update.title = createDto.title;
    update.body = createDto.body;
    update.type = createDto.type;
    update.task = task;

    return this.updateRepo.save(update);
  }

  async get(taskId: number, updateId: number): Promise<UpdateEntity> {
    return this.updateRepo.findOneOrException({
      id: updateId,
      task: { id: taskId },
    });
  }

  async update(
    taskId: number,
    updateId: number,
    updateDto: UpdateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateEntity> {
    const where = { id: updateId, task: { id: taskId } };
    const option = { relations: ['task'] };
    const update = await this.updateRepo.findOneOrException(where, option);

    this.canManage(update.task.isStaff(employee), 'Update');

    update.title = updateDto.title;
    update.body = updateDto.body;
    update.type = updateDto.type;

    return this.updateRepo.save(update);
  }

  async delete(
    taskId: number,
    updateId: number,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: updateId, task: { id: taskId } };
    const option = { relations: ['task'] };
    const update = await this.updateRepo.findOneOrException(where, option);

    this.canManage(update.task.isStaff(employee), 'Update');

    await this.updateRepo.delete(update);
  }
}
