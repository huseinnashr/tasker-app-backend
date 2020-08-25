import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactDTO } from './task-artifact.dto';

export class TaskArtifactEntityDTO extends EntityPermissionResponseDTO<
  TaskArtifactDTO
> {
  @Type(() => TaskArtifactDTO)
  data: TaskArtifactDTO;
}
