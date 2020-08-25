import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';
import {
  TaskRepository,
  UpdateRepository,
  FileRepository,
} from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEntity, EmployeeEntity } from '../database/entity';
import {
  CreateUpdateDTO,
  UpdateUpdateDTO,
  TaskUpdateListDTO,
  TaskUpdateListEntityDTO,
  TaskUpdateEntityDTO,
} from './dto';
import { ProjectTaskParamDTO, TaskUpdateParamDTO } from '../shared/dto';
import { UpdatePermission } from '../shared/permission';

@Injectable()
export class TaskUpdateService extends AppService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(UpdateRepository) private updateRepo: UpdateRepository,
    @InjectRepository(FileRepository) private fileRepo: FileRepository,
    private updatePermission: UpdatePermission,
  ) {
    super();
  }

  async getAll(
    param: ProjectTaskParamDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateListDTO> {
    const task = await this.taskRepo.findOneOrException(param.taskId);
    const updates = await this.updateRepo.find({ where: { task } });

    return this.transform(TaskUpdateListDTO, {
      data: updates,
      permission: this.updatePermission.getList(task, employee),
    });
  }

  async create(
    param: ProjectTaskParamDTO,
    createDto: CreateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityDTO> {
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

    await this.updateRepo.save(update);

    return this.transform(TaskUpdateListEntityDTO, { data: update });
  }

  async get(
    param: TaskUpdateParamDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateEntityDTO> {
    const where = { id: param.updateId, task: { id: param.taskId } };
    const option = { relations: ['task'] };
    const update = await this.updateRepo.findOneOrException(where, option);

    return this.transform(TaskUpdateEntityDTO, {
      data: update,
      permission: this.updatePermission.getEntity(update, employee),
    });
  }

  async update(
    param: TaskUpdateParamDTO,
    updateDto: UpdateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityDTO> {
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

    await this.updateRepo.save(update);

    return this.transform(TaskUpdateListEntityDTO, { data: update });
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
