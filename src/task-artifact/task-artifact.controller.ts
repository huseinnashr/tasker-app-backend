import {
  Controller,
  SerializeOptions,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { TaskArtifactService } from './task-artifact.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Role } from '../database/enum';
import { ArtifactEntity, EmployeeEntity } from '../database/entity';
import { CreateArtifactDTO } from './dto';

@Controller('task/:taskId/artifact')
@SerializeOptions({ groups: ['task-artifact'] })
export class TaskArtifactController {
  constructor(private taskArtifactService: TaskArtifactService) {}

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param('taskId') taskId: number,
    @Body() createDto: CreateArtifactDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ArtifactEntity> {
    return this.taskArtifactService.create(taskId, createDto, employee);
  }
}
