import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { Task } from '../task/task.entity';
import { Auth, CurrentEmployee } from '../auth/auth.decorator';
import { Role } from '../employee/role.enum';
import { CreateTaskDTO } from './dto';
import { Employee } from '../employee/employee.entity';

@Controller('project/:projectId/task')
export class ProjectTaskController {
  constructor(private proTaskService: ProjectTaskService) {}

  @Get('/')
  @Auth()
  async getAll(@Param('projectId') projectId: number): Promise<Task[]> {
    return this.proTaskService.getAll(projectId);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param('projectId') projectId: number,
    @Body() taskDto: CreateTaskDTO,
    @CurrentEmployee() employee: Employee,
  ): Promise<Task> {
    return this.proTaskService.create(projectId, taskDto, employee);
  }

  @Get('/:taskId')
  @Auth()
  async get(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
  ): Promise<Task> {
    return this.proTaskService.get(projectId, taskId);
  }
}
