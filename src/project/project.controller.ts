import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  SerializeOptions,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity, ProjectEntity } from '../database/entity';
import { Role } from '../database/enum';
import { CreateProjectDTO, UpdateProjectDTO, ProjectStatusDTO } from './dto';

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

  @Get('/:id')
  @Auth()
  async get(@Param('id', ParseIntPipe) id: number): Promise<ProjectEntity> {
    return this.projectService.get(id);
  }

  @Put('/:id')
  @Auth(Role.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDTO,
  ): Promise<ProjectEntity> {
    return this.projectService.update(id, updateDto);
  }

  @Put('/:id/status')
  @Auth(Role.MANAGER)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: ProjectStatusDTO,
  ): Promise<ProjectEntity> {
    return this.projectService.updateStatus(id, statusDto);
  }

  @Delete('/:id')
  @Auth(Role.MANAGER)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ProjectEntity> {
    return this.projectService.delete(id);
  }
}
