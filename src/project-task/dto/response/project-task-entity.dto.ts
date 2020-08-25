import { Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { ProjectTaskDTO } from './project-task.dto';

export class ProjectTaskEntityDTO extends EntityPermissionResponseDTO<
  ProjectTaskDTO
> {
  @Type(() => ProjectTaskDTO)
  data: ProjectTaskDTO;
}
