import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  ProjectTaskListResponseDTO,
  ProjectTaskEntityResponseDTO,
} from './dto';
import { EmployeeEntity, TaskEntity } from '../database/entity';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';
import { TaskStatus } from '../database/enum';
import { AppService } from '../core/app.service';
import { ProjectParamDTO, ProjectTaskParamDTO } from '../shared/dto';
import { TaskPermission } from '../shared/permission/task.permission';

@Injectable()
export class ProjectTaskService extends AppService {
  private taskPermission: TaskPermission;

  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();

    this.taskPermission = new TaskPermission();
  }

  async getAll(
    param: ProjectParamDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskListResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);
    const tasks = await this.taskRepo.find({ where: { project } });

    return this.transform(ProjectTaskListResponseDTO, {
      data: tasks,
      permission: this.taskPermission.getList(project, employee),
    });
  }

  async create(
    param: ProjectParamDTO,
    createDto: CreateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskEntityResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    this.canManage(project.isManager(employee), 'Project');

    const staff = await this.empRepo.findOne(createDto.employeeId);
    this.existOrUnprocessable(staff, 'staff');

    const task = new TaskEntity();
    task.title = createDto.title;
    task.body = createDto.body;
    task.staff = staff;
    task.project = project;
    task.status = TaskStatus.IN_PROGRESS;

    await this.taskRepo.save(task);

    return this.transform(ProjectTaskEntityResponseDTO, {
      data: task,
      permission: this.taskPermission.getEntity(task, employee),
    });
  }

  async get(
    param: ProjectTaskParamDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskEntityResponseDTO> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    return this.transform(ProjectTaskEntityResponseDTO, {
      data: task,
      permission: this.taskPermission.getEntity(task, employee),
    });
  }

  async update(
    param: ProjectTaskParamDTO,
    updateTask: UpdateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskEntityResponseDTO> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    this.canManage(task.project.isManager(employee), 'Task');

    task.title = updateTask.title;
    task.body = updateTask.body;

    if (task.staff.id !== updateTask.employeeId) {
      const staff = await this.empRepo.findOne(updateTask.employeeId);
      this.existOrUnprocessable(staff, 'staff');

      task.staff = staff;
    }

    await this.taskRepo.save(task);

    return this.transform(ProjectTaskEntityResponseDTO, {
      data: task,
      permission: this.taskPermission.getEntity(task, employee),
    });
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
