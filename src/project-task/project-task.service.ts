import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { EmployeeEntity, TaskEntity } from '../database/entity';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';
import { TaskStatus } from '../database/enum';
import { AppService } from '../core/app.service';
import { ProjectParamDTO, ProjectTaskParamDTO } from '../shared/dto';

@Injectable()
export class ProjectTaskService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();
  }

  async getAll(param: ProjectParamDTO): Promise<TaskEntity[]> {
    const project = await this.proRepo.findOneOrException(param.projectId);
    return this.taskRepo.find({ where: { project } });
  }

  async create(
    param: ProjectParamDTO,
    createDto: CreateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<TaskEntity> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    this.canManage(project.isManager(employee), 'Project');

    const staff = await this.existOrUnprocessable(
      this.empRepo.findOne(createDto.employeeId),
      'staff',
    );

    const task = new TaskEntity();
    task.title = createDto.title;
    task.body = createDto.body;
    task.staff = staff;
    task.project = project;
    task.status = TaskStatus.IN_PROGRESS;

    return this.taskRepo.save(task);
  }

  async get(param: ProjectTaskParamDTO): Promise<TaskEntity> {
    return this.taskRepo.findOneOrException({
      id: param.taskId,
      project: { id: param.projectId },
    });
  }

  async update(
    param: ProjectTaskParamDTO,
    updateTask: UpdateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<TaskEntity> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    this.canManage(task.project.isManager(employee), 'Task');

    task.title = updateTask.title;
    task.body = updateTask.body;

    if (task.staff.id !== updateTask.employeeId) {
      const staff = await this.existOrUnprocessable(
        this.empRepo.findOne(updateTask.employeeId),
        'staff',
      );

      task.staff = staff;
    }

    return this.taskRepo.save(task);
  }

  async delete(
    param: ProjectTaskParamDTO,
    employee: EmployeeEntity,
  ): Promise<void> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    this.canManage(task.project.isManager(employee), 'Task');

    await this.taskRepo.remove(task);
  }
}
