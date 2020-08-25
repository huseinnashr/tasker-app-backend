import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { ProjectTaskDTO } from './project-task.dto';
import { Type } from 'class-transformer';

export class ProjectTaskListEntityDTO extends EntityResponseDTO<
  ProjectTaskDTO
> {
  @Type(() => ProjectTaskDTO)
  data: ProjectTaskDTO;
}
