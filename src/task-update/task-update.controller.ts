import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskUpdateService } from './task-update.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity } from '../database/entity';
import { Role } from '../database/enum';
import {
  CreateUpdateDTO,
  UpdateUpdateDTO,
  TaskUpdateListEntityResponseDTO,
  TaskUpdateListResponseDTO,
  TaskUpdateEntityResponseDTO,
} from './dto';
import { TaskUpdateParamDTO, ProjectTaskParamDTO } from '../shared/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('project/:projectId/task/:taskId/update')
@ApiTags('Project.Task.Update')
export class TaskUpdateController {
  constructor(private taskUpdService: TaskUpdateService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: ProjectTaskParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListResponseDTO> {
    return this.taskUpdService.getAll(param, employee);
  }

  @Post('/')
  @Auth(Role.STAFF)
  async create(
    @Param() param: ProjectTaskParamDTO,
    @Body() createDto: CreateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityResponseDTO> {
    return this.taskUpdService.create(param, createDto, employee);
  }

  @Get('/:updateId')
  @Auth()
  async get(
    @Param() param: TaskUpdateParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateEntityResponseDTO> {
    return this.taskUpdService.get(param, employee);
  }

  @Put('/:updateId')
  @Auth(Role.STAFF)
  async update(
    @Param() param: TaskUpdateParamDTO,
    @Body() updateDto: UpdateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityResponseDTO> {
    return this.taskUpdService.update(param, updateDto, employee);
  }

  @Delete('/:updateId')
  @Auth(Role.STAFF)
  async delete(
    @Param() param: TaskUpdateParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskUpdService.delete(param, employee);
  }
}
