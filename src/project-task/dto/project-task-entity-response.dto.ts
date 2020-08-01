import { Expose, Type } from 'class-transformer';
import { EntityResponseDTO } from '../../shared/dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';

export class ProjectTaskEntityResponseDTO extends EntityResponseDTO<
  ProjectTaskResponseDTO
> {
  @Expose()
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO;
}
