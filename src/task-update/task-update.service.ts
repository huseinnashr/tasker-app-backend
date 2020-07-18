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
import { ProjectTaskParamDTO, TaskUpdateParamDTO } from '../shared/dto';

@Injectable()
export class TaskUpdateService extends AppService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(FileRepository) private fileRepo: FileRepository,
  ) {
    super();
  }

  async getAll(param: ProjectTaskParamDTO): Promise<UpdateEntity[]> {
    const task = await this.taskRepo.findOneOrException(param.taskId);
    return this.updateRepo.find({ where: { task } });
  }

  async create(
    param: ProjectTaskParamDTO,
    createDto: CreateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateEntity> {
    const task = await this.taskRepo.findOneOrException(param.taskId);

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

  async get(param: TaskUpdateParamDTO): Promise<UpdateEntity> {
    return this.updateRepo.findOneOrException({
      id: param.updateId,
      task: { id: param.taskId },
    });
  }

  async update(
    param: TaskUpdateParamDTO,
    updateDto: UpdateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<UpdateEntity> {
    const where = { id: param.updateId, task: { id: param.taskId } };
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
    param: TaskUpdateParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const where = { id: param.updateId, task: { id: param.taskId } };
    const option = { relations: ['task'] };
    const update = await this.updateRepo.findOneOrException(where, option);

    this.canManage(update.task.isStaff(employee), 'Update');

    await this.updateRepo.remove(update);
  }
}
