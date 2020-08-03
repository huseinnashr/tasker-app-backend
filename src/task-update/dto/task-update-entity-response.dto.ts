import { EntityPermissionResponseDTO } from '../../shared/dto';
import { TaskUpdateResponseDTO } from './task-update-response.dto';
import { Type } from 'class-transformer';

export class TaskUpdateEntityResponseDTO extends EntityPermissionResponseDTO<
  TaskUpdateResponseDTO
> {
  @Type(() => TaskUpdateResponseDTO)
  data: TaskUpdateResponseDTO;
}
