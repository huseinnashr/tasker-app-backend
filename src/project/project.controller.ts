import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth } from '../auth/auth.decorator';
import { Project } from './project.entity';
import { Role } from '../employee/role.enum';
import { CreateProjectDTO } from './project.dto';

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
  async create(@Body() createDto: CreateProjectDTO): Promise<Project> {
    return this.projectService.create(createDto);
  }
}
