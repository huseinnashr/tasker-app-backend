import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  SerializeOptions,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity, ProjectEntity } from '../database/entity';
import { Role } from '../database/enum';
import { CreateProjectDTO, UpdateProjectDTO, ProjectStatusDTO } from './dto';
import { ProjectParamDTO } from '../shared/dto';

@Controller('project')
@SerializeOptions({ groups: ['project'] })
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/')
  @Auth()
  async getAll(): Promise<ProjectEntity[]> {
    return this.projectService.getAll();
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Body() createDto: CreateProjectDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ProjectEntity> {
    return this.projectService.create(createDto, employee);
  }

  @Get('/:projectId')
  @Auth()
  async get(@Param() param: ProjectParamDTO): Promise<ProjectEntity> {
    return this.projectService.get(param);
  }

  @Put('/:projectId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: ProjectParamDTO,
    @Body() updateDto: UpdateProjectDTO,
  ): Promise<ProjectEntity> {
    return this.projectService.update(param, updateDto);
  }

  @Put('/:projectId/status')
  @Auth(Role.MANAGER)
  async updateStatus(
    @Param() param: ProjectParamDTO,
    @Body() statusDto: ProjectStatusDTO,
  ): Promise<ProjectEntity> {
    return this.projectService.updateStatus(param, statusDto);
  }

  @Delete('/:projectId')
  @Auth(Role.MANAGER)
  async delete(@Param() param: ProjectParamDTO): Promise<void> {
    return this.projectService.delete(param);
  }
}
