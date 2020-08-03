import { ListPermissionResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactResponseDTO } from './task-artifact-response.dto';

export class TaskArtifactListResponseDTO extends ListPermissionResponseDTO<
  TaskArtifactResponseDTO
> {
  @Type(() => TaskArtifactResponseDTO)
  data: TaskArtifactResponseDTO[];
}
