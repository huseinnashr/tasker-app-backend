import { Type } from 'class-transformer';
import { ListPermissionResponseDTO } from '../../shared/dto';
import { ProjectTaskResponseDTO } from './project-task-response.dto';

export class ProjectTaskListResponseDTO extends ListPermissionResponseDTO<
  ProjectTaskResponseDTO
> {
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO[];
}
