import {
  Controller,
  Post,
  Param,
  Body,
  Put,
  Delete,
  Get,
} from '@nestjs/common';
import { TaskArtifactService } from './task-artifact.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Role } from '../database/enum';
import { EmployeeEntity } from '../database/entity';
import {
  CreateArtifactDTO,
  UpdateArtifactDTO,
  AssignUpdateDTO,
  TaskArtifactListDTO,
  TaskArtifactListEntityDTO,
  ArtifactUpdateEntityDTO,
  TaskArtifactRPar,
  TaskArtifactEPar,
} from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('project/:projectId/task/:taskId/artifact')
@ApiTags('Project.Task.Artifact')
export class TaskArtifactController {
  constructor(private taskArtifactService: TaskArtifactService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: TaskArtifactRPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskArtifactListDTO> {
    return this.taskArtifactService.getAll(param, employee);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param() param: TaskArtifactRPar,
    @Body() createDto: CreateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskArtifactListEntityDTO> {
    return this.taskArtifactService.create(param, createDto, employee);
  }

  @Put('/:artifactId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: TaskArtifactEPar,
    @Body() updateDto: UpdateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<TaskArtifactListEntityDTO> {
    return this.taskArtifactService.update(param, updateDto, employee);
  }

  @Delete('/:artifactId')
  @Auth(Role.MANAGER)
  async delete(
    @Param() param: TaskArtifactEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskArtifactService.delete(param, employee);
  }

  @Put('/:artifactId/update')
  @Auth(Role.MANAGER)
  async assignUpdate(
    @Param() param: TaskArtifactEPar,
    @Body() assignDto: AssignUpdateDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactUpdateEntityDTO> {
    return this.taskArtifactService.assignUpdate(param, assignDto, employee);
  }

  @Delete('/:artifactId/update')
  @Auth(Role.MANAGER)
  async removeUpdate(
    @Param() param: TaskArtifactEPar,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskArtifactService.removeUpdate(param, employee);
  }
}
