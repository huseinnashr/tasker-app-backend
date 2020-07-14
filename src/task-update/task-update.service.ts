import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';
import {
  TaskRepository,
  UpdateRepository,
  FileRepository,
} from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEntity, EmployeeEntity } from '../database/entity';
import { CreateUpdateDTO, UpdateUpdateDTO } from './dto';

@Injectable()
export class TaskUpdateService extends AppService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(FileRepository) private fileRepo: FileRepository,
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

    const files = await this.fileRepo.findByIds(createDto.files, {
      where: { owner: { id: employee.id } },
    });

    update.files = files;
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

    const files = await this.fileRepo.findByIds(updateDto.files, {
      where: { owner: { id: employee.id } },
    });

    update.files = files;

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

    await this.updateRepo.remove(update);
  }
}
