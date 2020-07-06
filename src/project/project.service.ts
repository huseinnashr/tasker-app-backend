import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { CreateProjectDTO, UpdateProjectDTO } from './project.dto';
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
    const project = new Project();
    project.title = createDto.title;
    project.body = createDto.body;
    project.status = Status.IN_PROGRESS;

    return this.proRepo.save(project);
  }

  async get(id: number): Promise<Project> {
    const project = await this.proRepo.findOne(id);

    if (!project) {
      throw new NotFoundException(`Project with id:${id} was not found`);
    }

    return project;
  }

  async update(id: number, updateDto: UpdateProjectDTO): Promise<Project> {
    const project = await this.get(id);

    project.title = updateDto.title;
    project.body = updateDto.body;

    await this.proRepo.save(project);

    return project;
  }

  async delete(id: number): Promise<Project> {
    const project = await this.get(id);

    return this.proRepo.remove(project);
  }
}
