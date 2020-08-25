import { ListPermissionResponseDTO } from '../../shared/dto';
import { Type } from 'class-transformer';
import { TaskArtifactDTO } from './task-artifact.dto';

export class TaskArtifactListDTO extends ListPermissionResponseDTO<
  TaskArtifactDTO
> {
  @Type(() => TaskArtifactDTO)
  data: TaskArtifactDTO[];
}
