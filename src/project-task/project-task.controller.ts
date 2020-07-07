import { Controller, Get, Param } from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { Task } from '../task/task.entity';
import { Auth } from '../auth/auth.decorator';

@Controller('project/:projectId/task')
export class ProjectTaskController {
  constructor(private proTaskService: ProjectTaskService) {}

  @Get('/')
  @Auth()
  async getAll(@Param('projectId') projectId: number): Promise<Task[]> {
    return this.proTaskService.getAll(projectId);
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
