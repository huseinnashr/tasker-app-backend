import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Auth } from '../auth/auth.decorator';
import { Project } from './project.entity';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/')
  @Auth()
  async getAll(): Promise<Project[]> {
    return this.projectService.getAll();
  }
}
