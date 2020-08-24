import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectRepository } from '../database/repository';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ManagerProjectStatusDTO,
  ManagerProjectListEntityResponseDTO,
  ManagerProjectListResponseDTO,
  ManagerProjectEntityResponseDTO,
} from './dto';
import { ProjectStatus } from '../database/enum';
import { EmployeeEntity, ProjectEntity } from '../database/entity';
import { AppService } from '../core/app.service';
import { ProjectParamDTO } from '../shared/dto';
import { ProjectPermission } from '../shared/permission';

@Injectable()
export class ManagerProjectService extends AppService {
  constructor(
    @InjectRepository(ProjectRepository)
    private proRepo: ProjectRepository,
    private projectPermission: ProjectPermission,
  ) {
    super();
  }

  async getAll(
    employee: EmployeeEntity,
  ): Promise<ManagerProjectListResponseDTO> {
    const projects = await this.proRepo.find();

    return this.transform(ManagerProjectListResponseDTO, {
      data: projects,
      permission: this.projectPermission.getList(null, employee),
    });
  }

  async create(
    createDto: CreateProjectDTO,
    employe: EmployeeEntity,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    const project = new ProjectEntity();
    project.title = createDto.title;
    project.body = createDto.body;
    project.status = ProjectStatus.IN_PROGRESS;
    project.manager = employe;

    await this.proRepo.save(project);

    return this.transform(ManagerProjectListEntityResponseDTO, {
      data: project,
    });
  }

  async get(
    param: ProjectParamDTO,
    employee: EmployeeEntity,
  ): Promise<ManagerProjectEntityResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    return this.transform(ManagerProjectEntityResponseDTO, {
      data: project,
      permission: this.projectPermission.getEntity(project, employee),
    });
  }

  async update(
    param: ProjectParamDTO,
    updateDto: UpdateProjectDTO,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    project.title = updateDto.title;
    project.body = updateDto.body;

    await this.proRepo.save(project);

    return this.transform(ManagerProjectListEntityResponseDTO, {
      data: project,
    });
  }

  async updateStatus(
    param: ProjectParamDTO,
    statusDto: ManagerProjectStatusDTO,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    const project = await this.proRepo.findOneOrException(param.projectId);
    project.status = statusDto.status;

    await this.proRepo.save(project);

    return this.transform(ManagerProjectListEntityResponseDTO, {
      data: project,
    });
  }

  async delete(param: ProjectParamDTO): Promise<void> {
    const project = await this.proRepo.findOneOrException(param.projectId);

    await this.proRepo.remove(project);
  }
}
