import { Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from '../../shared/dto';
import { ProjectResponseDTO } from './project-response.dto';

export class ProjectEntityResponseDTO extends EntityPermissionResponseDTO<
  ProjectResponseDTO
> {
  @Type(() => ProjectResponseDTO)
  data: ProjectResponseDTO;
}
