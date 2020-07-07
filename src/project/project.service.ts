import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectStatusDTO,
} from './project.dto';
import { Status } from './status.enum';
import { Employee } from '../employee/employee.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectMemberRole } from './project-member-role.enum';
import { getRepository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
  ) {}

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
    project.status = Status.IN_PROGRESS;
    await this.proRepo.save(project);

    const projectMember = new ProjectMember();
    projectMember.projectId = project.id;
    projectMember.employeeId = employe.id;
    projectMember.role = ProjectMemberRole.MANAGER;
    await getRepository(ProjectMember).save(projectMember);

    project.projectMember = [projectMember];
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

  async updateStatus(
    id: number,
    statusDto: ProjectStatusDTO,
  ): Promise<Project> {
    const project = await this.get(id);

    project.status = statusDto.status;

    await this.proRepo.save(project);

    return project;
  }

  async delete(id: number): Promise<Project> {
    const project = await this.get(id);

    return this.proRepo.remove(project);
  }
}
