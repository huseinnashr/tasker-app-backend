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
import { CreateUpdateDTO, UpdateUpdateDTO, TaskUpdateResponseDTO } from './dto';
import { TaskUpdateParamDTO, ProjectTaskParamDTO } from '../shared/dto';

@Controller('project/:projectId/task/:taskId/update')
export class TaskUpdateController {
  constructor(private taskUpdService: TaskUpdateService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: ProjectTaskParamDTO,
  ): Promise<TaskUpdateResponseDTO[]> {
    return this.taskUpdService.getAll(param);
  }

  @Post('/')
  @Auth(Role.STAFF)
  async create(
    @Param() param: ProjectTaskParamDTO,
    @Body() createDto: CreateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateResponseDTO> {
    return this.taskUpdService.create(param, createDto, employee);
  }

  @Get('/:updateId')
  @Auth()
  async get(
    @Param() param: TaskUpdateParamDTO,
  ): Promise<TaskUpdateResponseDTO> {
    return this.taskUpdService.get(param);
  }

  @Put('/:updateId')
  @Auth(Role.STAFF)
  async update(
    @Param() param: TaskUpdateParamDTO,
    @Body() updateDto: UpdateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateResponseDTO> {
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
