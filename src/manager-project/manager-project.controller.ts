import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ManagerProjectService } from './manager-project.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity } from '../database/entity';
import { Role } from '../database/enum';
import {
  CreateProjectDTO,
  UpdateProjectDTO,
  ManagerProjectStatusDTO,
  ManagerProjectListResponseDTO,
  ManagerProjectListEntityResponseDTO,
  ManagerProjectEntityResponseDTO,
} from './dto';
import { ProjectParamDTO, ManagerParamDTO } from '../shared/dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('manager/:managerId/project')
@ApiTags('Manager.Project')
export class ManagerProjectController {
  constructor(private projectService: ManagerProjectService) {}

  @Get('/')
  @Auth()
  async getAll(
    @Param() param: ManagerParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ManagerProjectListResponseDTO> {
    return this.projectService.getAll(param, employee);
  }

  @Post('/')
  @Auth(Role.MANAGER)
  async create(
    @Param() param: ManagerParamDTO,
    @Body() createDto: CreateProjectDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    return this.projectService.create(param, createDto, employee);
  }

  @Get('/:projectId')
  @Auth()
  async get(
    @Param() param: ProjectParamDTO,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<ManagerProjectEntityResponseDTO> {
    return this.projectService.get(param, employee);
  }

  @Put('/:projectId')
  @Auth(Role.MANAGER)
  async update(
    @Param() param: ProjectParamDTO,
    @Body() updateDto: UpdateProjectDTO,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    return this.projectService.update(param, updateDto);
  }

  @Put('/:projectId/status')
  @Auth(Role.MANAGER)
  async updateStatus(
    @Param() param: ProjectParamDTO,
    @Body() statusDto: ManagerProjectStatusDTO,
  ): Promise<ManagerProjectListEntityResponseDTO> {
    return this.projectService.updateStatus(param, statusDto);
  }

  @Delete('/:projectId')
  @Auth(Role.MANAGER)
  async delete(@Param() param: ProjectParamDTO): Promise<void> {
    return this.projectService.delete(param);
  }
}
