import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth } from '../auth/auth.decorator';
import { Project } from './project.entity';
import { Role } from '../employee/role.enum';
import { CreateProjectDTO, UpdateProjectDTO } from './project.dto';

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
}
