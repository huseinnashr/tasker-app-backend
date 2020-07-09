import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task/task.entity';
import { CreateTaskDTO } from './dto';
import { Employee } from '../employee/employee.entity';
import {
  EmployeeRepository,
  ProjectRepository,
  TaskRepository,
} from '../database/repository';
import { TaskStatus } from '../task/task-status.enum';
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
}
