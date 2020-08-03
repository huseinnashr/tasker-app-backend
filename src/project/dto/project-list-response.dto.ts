import { Type } from 'class-transformer';
import { ListPermissionResponseDTO } from '../../shared/dto';
import { ProjectResponseDTO } from './project-response.dto';

export class ProjectListResponseDTO extends ListPermissionResponseDTO<
  ProjectResponseDTO
> {
  @Type(() => ProjectResponseDTO)
  data: ProjectResponseDTO[];
}
