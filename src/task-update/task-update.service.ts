import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';
import {
  TaskRepository,
  UpdateRepository,
  FileRepository,
} from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateEntity, EmployeeEntity } from '../database/entity';
import { CreateUpdateDTO, UpdateUpdateDTO, TaskUpdateResponseDTO } from './dto';
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

  async getAll(param: ProjectTaskParamDTO): Promise<TaskUpdateResponseDTO[]> {
    const task = await this.taskRepo.findOneOrException(param.taskId);
    const updates = await this.updateRepo.find({ where: { task } });

    return this.transform(TaskUpdateResponseDTO, updates);
  }

  async create(
    param: ProjectTaskParamDTO,
    createDto: CreateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateResponseDTO> {
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

    return this.transform(TaskUpdateResponseDTO, update);
  }

  async get(param: TaskUpdateParamDTO): Promise<TaskUpdateResponseDTO> {
    const update = await this.updateRepo.findOneOrException({
      id: param.updateId,
      task: { id: param.taskId },
    });

    return this.transform(TaskUpdateResponseDTO, update);
  }

  async update(
    param: TaskUpdateParamDTO,
    updateDto: UpdateUpdateDTO,
    employee: EmployeeEntity,
  ): Promise<TaskUpdateResponseDTO> {
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

    return this.transform(TaskUpdateResponseDTO, update);
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
