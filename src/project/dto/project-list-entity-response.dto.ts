import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { Type } from 'class-transformer';
import { ProjectResponseDTO } from './project-response.dto';

export class ProjectListEntityResponseDTO extends EntityResponseDTO<
  ProjectResponseDTO
> {
  @Type(() => ProjectResponseDTO)
  data: ProjectResponseDTO;
}
