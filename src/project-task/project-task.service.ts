import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { Employee, Task } from '../database/entity';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';
import { TaskStatus } from '../database/enum';
import { AppService } from '../core/app.service';

@Injectable()
export class ProjectTaskService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
    @InjectRepository(TaskRepository) private taskRepo: TaskRepository,
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();
  }

  async getAll(projectId: number): Promise<Task[]> {
    const project = await this.proRepo.findOneOrException(projectId);
    return this.taskRepo.find({ where: { project } });
  }

  async create(
    projectId: number,
    createDto: CreateTaskDTO,
    employee: Employee,
  ): Promise<Task> {
    const project = await this.proRepo.findOneOrException(projectId);

    this.canManage(project.isManager(employee), 'Project');

    const staff = await this.existOrUnprocessable(
      this.empRepo.findOne(createDto.employeeId),
      'staff',
    );

    const task = new Task();
    task.title = createDto.title;
    task.body = createDto.body;
    task.staff = staff;
    task.project = project;
    task.status = TaskStatus.IN_PROGRESS;

    return this.taskRepo.save(task);
  }

  async get(projectId: number, taskId: number): Promise<Task> {
    return this.taskRepo.findOneOrException({
      id: taskId,
      project: { id: projectId },
    });
  }

  async update(
    projectId: number,
    taskId: number,
    updateTask: UpdateTaskDTO,
    employee: Employee,
  ): Promise<Task> {
    const taskWhere = { id: taskId, project: { id: projectId } };
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
    projectId: number,
    taskId: number,
    employee: Employee,
  ): Promise<void> {
    const taskWhere = { id: taskId, project: { id: projectId } };
    const taskOption = { relations: ['project'] };
    const task = await this.taskRepo.findOneOrException(taskWhere, taskOption);

    this.canManage(task.project.isManager(employee), 'Task');

    await this.taskRepo.delete(task);
  }
}
