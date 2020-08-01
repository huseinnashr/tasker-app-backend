import { Expose, Type } from 'class-transformer';
import { ListResponseDTO } from '../../shared/dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';

export class ProjectTaskListResponseDTO extends ListResponseDTO<
  ProjectTaskResponseDTO
> {
  @Expose()
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO[];
}
