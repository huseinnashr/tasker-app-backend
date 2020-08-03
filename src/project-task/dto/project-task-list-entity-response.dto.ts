import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';
import { Type } from 'class-transformer';

export class ProjectTaskListEntityResponseDTO extends EntityResponseDTO<
  ProjectTaskResponseDTO
> {
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO;
}
