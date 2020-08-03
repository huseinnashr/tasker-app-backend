import { EntityPermissionResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactResponseDTO } from './task-artifact-response.dto';

export class TaskArtifactEntityResponseDTO extends EntityPermissionResponseDTO<
  TaskArtifactResponseDTO
> {
  @Type(() => TaskArtifactResponseDTO)
  data: TaskArtifactResponseDTO;
}
