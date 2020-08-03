import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity } from '../database/entity';
import { Role } from '../database/enum';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
  ProjectListResponseDTO,
  ProjectListEntityResponseDTO,
  ProjectEntityResponseDTO,
} from './dto';
import { ProjectParamDTO } from '../shared/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('project')
@ApiTags('Project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/')
  @Auth()
  async getAll(
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ProjectListResponseDTO> {
    return this.projectService.getAll(employee);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Body() createDto: CreateProjectDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ProjectListEntityResponseDTO> {
    return this.projectService.create(createDto, employee);
  }

  @Get('/:projectId')
  @Auth()
  async get(
    @Param() param: ProjectParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ProjectEntityResponseDTO> {
    return this.projectService.get(param, employee);
  }

  @Put('/:projectId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: ProjectParamDTO,
    @Body() updateDto: UpdateProjectDTO,
  ): Promise<ProjectListEntityResponseDTO> {
    return this.projectService.update(param, updateDto);
  }

  @Put('/:projectId/status')
  @Auth(Role.MANAGER)
  async updateStatus(
    @Param() param: ProjectParamDTO,
    @Body() statusDto: ProjectStatusDTO,
  ): Promise<ProjectListEntityResponseDTO> {
    return this.projectService.updateStatus(param, statusDto);
  }

  @Delete('/:projectId')
  @Auth(Role.MANAGER)
  async delete(@Param() param: ProjectParamDTO): Promise<void> {
    return this.projectService.delete(param);
  }
}
