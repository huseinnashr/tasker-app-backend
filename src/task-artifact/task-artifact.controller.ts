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

@Controller('task/:taskId/artifact')
@SerializeOptions({ groups: ['task-artifact'] })
export class TaskArtifactController {
  constructor(private taskArtifactService: TaskArtifactService) {}

  @Get('/')
  @Auth()
  async getAll(@Param('taskId') taskId: number): Promise<ArtifactEntity[]> {
    return this.taskArtifactService.getAll(taskId);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param('taskId') taskId: number,
    @Body() createDto: CreateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    return this.taskArtifactService.create(taskId, createDto, employee);
  }

  @Put('/:artifactId')
  @Auth(Role.MANAGER)
  async update(
    @Param('taskId') taskId: number,
    @Param('artifactId') artifactId: number,
    @Body() updateDto: UpdateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    return this.taskArtifactService.update(
      taskId,
      artifactId,
      updateDto,
      employee,
    );
  }

  @Delete('/:artifactId')
  @Auth(Role.MANAGER)
  async delete(
    @Param('taskId') taskId: number,
    @Param('artifactId') artifactId: number,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<void> {
    return this.taskArtifactService.delete(taskId, artifactId, employee);
  }
}
