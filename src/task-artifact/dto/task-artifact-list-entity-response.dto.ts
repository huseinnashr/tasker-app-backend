import { EntityResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactResponseDTO } from './task-artifact-response.dto';

export class TaskArtifactListEntityResponseDTO extends EntityResponseDTO<
  TaskArtifactResponseDTO
> {
  @Type(() => TaskArtifactResponseDTO)
  data: TaskArtifactResponseDTO;
}
