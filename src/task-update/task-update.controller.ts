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
  TaskUpdateListEntityDTO,
  TaskUpdateListDTO,
  TaskUpdateEntityDTO,
  TaskUpdateRPar,
  TaskUpdateEPar,
} from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('project/:projectId/task/:taskId/update')
@ApiTags('Project.Task.Update')
export class TaskUpdateController {
  constructor(private taskUpdService: TaskUpdateService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: TaskUpdateRPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListDTO> {
    return this.taskUpdService.getAll(param, employee);
  }

  @Post('/')
  @Auth(Role.STAFF)
  async create(
    @Param() param: TaskUpdateRPar,
    @Body() createDto: CreateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityDTO> {
    return this.taskUpdService.create(param, createDto, employee);
  }

  @Get('/:updateId')
  @Auth()
  async get(
    @Param() param: TaskUpdateEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateEntityDTO> {
    return this.taskUpdService.get(param, employee);
  }

  @Put('/:updateId')
  @Auth(Role.STAFF)
  async update(
    @Param() param: TaskUpdateEPar,
    @Body() updateDto: UpdateUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskUpdateListEntityDTO> {
    return this.taskUpdService.update(param, updateDto, employee);
  }

  @Delete('/:updateId')
  @Auth(Role.STAFF)
  async delete(
    @Param() param: TaskUpdateEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskUpdService.delete(param, employee);
  }
}
