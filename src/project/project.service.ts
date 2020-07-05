import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { CreateProjectDTO } from './project.dto';
import { Status } from './status.enum';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private proRepo: ProjectRepository,
  ) {}

  async getAll(): Promise<Project[]> {
    return this.proRepo.find();
  }

  async create(createDto: CreateProjectDTO): Promise<Project> {
    const project = this.proRepo.create(createDto);
    project.status = Status.IN_PROGRESS;

    return this.proRepo.save(project);
  }
}
