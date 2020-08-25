import { EntityResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactDTO } from './task-artifact.dto';

export class TaskArtifactListEntityDTO extends EntityResponseDTO<
  TaskArtifactDTO
> {
  @Type(() => TaskArtifactDTO)
  data: TaskArtifactDTO;
}
