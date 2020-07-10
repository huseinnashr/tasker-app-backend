import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Role } from '../database/enum';
import { CreateTaskDTO, UpdateTaskDTO } from './dto';
import { Employee, Task } from '../database/entity';

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

  @Put('/:taskId')
  @Auth(Role.MANAGER)
  async update(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
    @Body() taskDto: UpdateTaskDTO,
    @CurrentEmployee() employee: Employee,
  ): Promise<Task> {
    return this.proTaskService.update(projectId, taskId, taskDto, employee);
  }

  @Delete('/:taskId')
  @Auth(Role.MANAGER)
  async delete(
    @Param('projectId') projectId: number,
    @Param('taskId') taskId: number,
    @CurrentEmployee() employee: Employee,
  ): Promise<void> {
    return this.proTaskService.delete(projectId, taskId, employee);
  }
}
