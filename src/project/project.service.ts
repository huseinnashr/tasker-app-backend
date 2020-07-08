import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
} from './project.dto';
import { ProjectStatus } from './project-status.enum';
import { Employee } from '../employee/employee.entity';
import { AppService } from '../core/app.service';

@Injectable()
export class ProjectService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
  ) {
    super();
  }

  async getAll(): Promise<Project[]> {
    return this.proRepo.find();
  }

  async create(
    createDto: CreateProjectDTO,
    employe: Employee,
  ): Promise<Project> {
    const project = new Project();
    project.title = createDto.title;
    project.body = createDto.body;
    project.status = ProjectStatus.IN_PROGRESS;
    project.manager = employe;

    return this.proRepo.save(project);
  }

  async get(id: number): Promise<Project> {
    return this.proRepo.findOneOrException(id);
  }

  async update(id: number, updateDto: UpdateProjectDTO): Promise<Project> {
    const project = await this.proRepo.findOneOrException(id);

    project.title = updateDto.title;
    project.body = updateDto.body;

    return this.proRepo.save(project);
  }

  async updateStatus(
    id: number,
    statusDto: ProjectStatusDTO,
  ): Promise<Project> {
    const project = await this.proRepo.findOneOrException(id);
    project.status = statusDto.status;

    return this.proRepo.save(project);
  }

  async delete(id: number): Promise<Project> {
    const project = await this.proRepo.findOneOrException(id);

    return this.proRepo.remove(project);
  }
}
