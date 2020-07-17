import {
  Controller,
  SerializeOptions,
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
import { ArtifactEntity, EmployeeEntity } from '../database/entity';
import { CreateArtifactDTO, UpdateArtifactDTO } from './dto';
import { TaskArtifactParamDTO, ProjectTaskParamDTO } from '../shared/dto';

@Controller('project/:projectId/task/:taskId/artifact')
@SerializeOptions({ groups: ['task-artifact'] })
export class TaskArtifactController {
  constructor(private taskArtifactService: TaskArtifactService) {}

  @Get('/')
  @Auth()
  async getAll(@Param() param: ProjectTaskParamDTO): Promise<ArtifactEntity[]> {
    return this.taskArtifactService.getAll(param);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param() param: ProjectTaskParamDTO,
    @Body() createDto: CreateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    return this.taskArtifactService.create(param, createDto, employee);
  }

  @Put('/:artifactId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: TaskArtifactParamDTO,
    @Body() updateDto: UpdateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    return this.taskArtifactService.update(param, updateDto, employee);
  }

  @Delete('/:artifactId')
  @Auth(Role.MANAGER)
  async delete(
    @Param() param: TaskArtifactParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskArtifactService.delete(param, employee);
  }
}
