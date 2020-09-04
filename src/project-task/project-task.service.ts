import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTaskDTO,
  UpdateTaskDTO,
  ProjectTaskListDTO,
  ProjectTaskEntityDTO,
  ProjectTaskListEntityDTO,
  ProjectTaskEPar,
  ProjectTaskRPar,
} from './dto';
import { EmployeeEntity, TaskEntity } from '../database/entity';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';
import { TaskStatus } from '../database/enum';
import { AppService } from '../core/app.service';
import { TaskPermission } from '../shared/permission';

@Injectable()
export class ProjectTaskService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
    private taskPermission: TaskPermission,
  ) {
    super();
  }

  async getAll(
    param: ProjectTaskRPar,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskListDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    const can = this.taskPermission.readAll(project, employee);
    this.canView(can, "Project's Task");

    const tasks = await this.taskRepo.find({ where: { project } });

    return this.transform(ProjectTaskListDTO, {
      data: tasks,
      permission: this.taskPermission.getList(project, employee),
    });
  }

  async create(
    param: ProjectTaskRPar,
    createDto: CreateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskListEntityDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    const can = this.taskPermission.create(project, employee);
    this.canManage(can, "Project's Task");

    const staff = await this.empRepo.findOne(createDto.employeeId);
    this.existOrUnprocessable(staff, 'staff');

    const task = new TaskEntity();
    task.title = createDto.title;
    task.body = createDto.body;
    task.staff = staff;
    task.project = project;
    task.status = TaskStatus.IN_PROGRESS;

    await this.taskRepo.save(task);

    return this.transform(ProjectTaskListEntityDTO, { data: task });
  }

  async get(
    param: ProjectTaskEPar,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskEntityDTO> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    const can = this.taskPermission.read(task, employee);
    this.canView(can, 'Task');

    return this.transform(ProjectTaskEntityDTO, {
      data: task,
      permission: this.taskPermission.getEntity(task, employee),
    });
  }

  async update(
    param: ProjectTaskEPar,
    updateTask: UpdateTaskDTO,
    employee: EmployeeEntity,
  ): Promise<ProjectTaskListEntityDTO> {
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

    return this.transform(ProjectTaskListEntityDTO, { data: task });
  }

  async delete(
    param: ProjectTaskEPar,
    employee: EmployeeEntity,
  ): Promise<void> {
    const taskWhere = { id: param.taskId, project: { id: param.projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    const can = this.taskPermission.delete(task, employee);
    this.canManage(can, 'Task');

    await this.taskRepo.remove(task);
  }
}
