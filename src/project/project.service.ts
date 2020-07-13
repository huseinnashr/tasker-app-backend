import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from '../database/repository';
import { CreateProjectDTO, UpdateProjectDTO, ProjectStatusDTO } from './dto';
import { ProjectStatus } from '../database/enum';
import { EmployeeEntity, ProjectEntity } from '../database/entity';
import { AppService } from '../core/app.service';

@Injectable()
export class ProjectService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
  ) {
    super();
  }

  async getAll(): Promise<ProjectEntity[]> {
    return this.proRepo.find();
  }

  async create(
    createDto: CreateProjectDTO,
    employe: EmployeeEntity,
  ): Promise<ProjectEntity> {
    const project = new ProjectEntity();
    project.title = createDto.title;
    project.body = createDto.body;
    project.status = ProjectStatus.IN_PROGRESS;
    project.manager = employe;

    return this.proRepo.save(project);
  }

  async get(id: number): Promise<ProjectEntity> {
    return this.proRepo.findOneOrException(id);
  }

  async update(
    id: number,
    updateDto: UpdateProjectDTO,
  ): Promise<ProjectEntity> {
    const project = await this.proRepo.findOneOrException(id);

    project.title = updateDto.title;
    project.body = updateDto.body;

    return this.proRepo.save(project);
  }

  async updateStatus(
    id: number,
    statusDto: ProjectStatusDTO,
  ): Promise<ProjectEntity> {
    const project = await this.proRepo.findOneOrException(id);
    project.status = statusDto.status;

    return this.proRepo.save(project);
  }

  async delete(id: number): Promise<ProjectEntity> {
    const project = await this.proRepo.findOneOrException(id);

    return this.proRepo.remove(project);
  }
}
