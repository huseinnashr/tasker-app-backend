import { Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from '../../shared/dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';

export class ProjectTaskEntityResponseDTO extends EntityPermissionResponseDTO<
  ProjectTaskResponseDTO
> {
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO;
}
