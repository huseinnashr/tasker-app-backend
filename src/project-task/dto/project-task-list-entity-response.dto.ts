import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';
import { Expose, Type } from 'class-transformer';

export class ProjectTaskListEntityResponseDTO extends EntityResponseDTO<
  ProjectTaskResponseDTO
> {
  @Expose()
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO;
}
