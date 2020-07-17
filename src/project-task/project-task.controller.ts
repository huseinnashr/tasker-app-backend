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
import { EmployeeEntity, TaskEntity } from '../database/entity';
import { ProjectParamDTO, ProjectTaskParamDTO } from '../shared/dto';

@Controller('project/:projectId/task')
export class ProjectTaskController {
  constructor(private proTaskService: ProjectTaskService) {}

  @Get('/')
  @Auth()
  async getAll(@Param() param: ProjectParamDTO): Promise<TaskEntity[]> {
    return this.proTaskService.getAll(param);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param() param: ProjectParamDTO,
    @Body() taskDto: CreateTaskDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskEntity> {
    return this.proTaskService.create(param, taskDto, employee);
  }

  @Get('/:taskId')
  @Auth()
  async get(@Param() param: ProjectTaskParamDTO): Promise<TaskEntity> {
    return this.proTaskService.get(param);
  }

  @Put('/:taskId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: ProjectTaskParamDTO,
    @Body() taskDto: UpdateTaskDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskEntity> {
    return this.proTaskService.update(param, taskDto, employee);
  }

  @Delete('/:taskId')
  @Auth(Role.MANAGER)
  async delete(
    @Param() param: ProjectTaskParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.proTaskService.delete(param, employee);
  }
}
