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
import { Update, Employee } from '../database/entity';
import { Role } from '../database/enum';
import { CreateUpdateDTO, UpdateUpdateDTO } from './dto';

@Controller('task/:taskId/update')
export class TaskUpdateController {
  constructor(private taskUpdService: TaskUpdateService) {}

  @Get('/')
  @Auth()
  async getAll(@Param('taskId') taskId: number): Promise<Update[]> {
    return this.taskUpdService.getAll(taskId);
  }

  @Post('/')
  @Auth(Role.STAFF)
  async create(
    @Param('taskId') taskId: number,
    @Body() createDto: CreateUpdateDTO,
    @CurrentEmployee() employee: Employee,
  ): Promise<Update> {
    return this.taskUpdService.create(taskId, createDto, employee);
  }

  @Get('/:updateId')
  @Auth()
  async get(
    @Param('taskId') taskId: number,
    @Param('updateId') updateId: number,
  ): Promise<Update> {
    return this.taskUpdService.get(taskId, updateId);
  }

  @Put('/:updateId')
  @Auth(Role.STAFF)
  async update(
    @Param('taskId') taskId: number,
    @Param('updateId') updateId: number,
    @Body() updateDto: UpdateUpdateDTO,
    @CurrentEmployee() employee: Employee,
  ): Promise<Update> {
    return this.taskUpdService.update(taskId, updateId, updateDto, employee);
  }

  @Delete('/:updateId')
  @Auth(Role.STAFF)
  async delete(
    @Param('taskId') taskId: number,
    @Param('updateId') updateId: number,
    @CurrentEmployee() employee: Employee,
  ): Promise<void> {
    return this.taskUpdService.delete(taskId, updateId, employee);
  }
}
