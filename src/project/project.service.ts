import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from '../database/repository';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
  ProjectResponseDTO,
} from './dto';
import { ProjectStatus } from '../database/enum';
import { EmployeeEntity, ProjectEntity } from '../database/entity';
import { AppService } from '../core/app.service';
import { ProjectParamDTO } from '../shared/dto';

@Injectable()
export class ProjectService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
  ) {
    super();
  }

  async getAll(): Promise<ProjectResponseDTO[]> {
    const projects = await this.proRepo.find();

    return this.transform(ProjectResponseDTO, projects);
  }

  async create(
    createDto: CreateProjectDTO,
    employe: EmployeeEntity,
  ): Promise<ProjectResponseDTO> {
    const project = new ProjectEntity();
    project.title = createDto.title;
    project.body = createDto.body;
    project.status = ProjectStatus.IN_PROGRESS;
    project.manager = employe;

    await this.proRepo.save(project);

    return this.transform(ProjectResponseDTO, project);
  }

  async get(param: ProjectParamDTO): Promise<ProjectEntity> {
    return this.proRepo.findOneOrException(param.projectId);
  }

  async update(
    param: ProjectParamDTO,
    updateDto: UpdateProjectDTO,
  ): Promise<ProjectResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    project.title = updateDto.title;
    project.body = updateDto.body;

    await this.proRepo.save(project);

    return this.transform(ProjectResponseDTO, project);
  }

  async updateStatus(
    param: ProjectParamDTO,
    statusDto: ProjectStatusDTO,
  ): Promise<ProjectResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);
    project.status = statusDto.status;

    await this.proRepo.save(project);

    return this.transform(ProjectResponseDTO, project);
  }

  async delete(param: ProjectParamDTO): Promise<void> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    await this.proRepo.remove(project);
  }
}
