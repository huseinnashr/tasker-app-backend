import { Type } from 'class-transformer';
import { ListPermissionResponseDTO } from '../../shared/dto';
import { ProjectTaskDTO } from './project-task.dto';

export class ProjectTaskListDTO extends ListPermissionResponseDTO<
  ProjectTaskDTO
> {
  @Type(() => ProjectTaskDTO)
  data: ProjectTaskDTO[];
}
