import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth, CurrentEmployee } from '../auth/auth.decorator';
import { Project } from './project.entity';
import { Role } from '../employee/role.enum';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
} from './project.dto';
import { Employee } from '../employee/employee.entity';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/')
  @Auth()
  async getAll(): Promise<Project[]> {
    return this.projectService.getAll();
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Body() createDto: CreateProjectDTO,
    @CurrentEmployee() employee: Employee,
  ): Promise<Project> {
    return this.projectService.create(createDto, employee);
  }

  @Get('/:id')
  @Auth()
  async get(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.get(id);
  }

  @Put('/:id')
  @Auth(Role.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDTO,
  ): Promise<Project> {
    return this.projectService.update(id, updateDto);
  }

  @Put('/:id/status')
  @Auth(Role.MANAGER)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: ProjectStatusDTO,
  ): Promise<Project> {
    return this.projectService.updateStatus(id, statusDto);
  }

  @Delete('/:id')
  @Auth(Role.MANAGER)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.delete(id);
  }
}
