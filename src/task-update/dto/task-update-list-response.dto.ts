import { ListPermissionResponseDTO } from '../../shared/dto';
import { TaskUpdateResponseDTO } from './task-update-response.dto';
import { Type } from 'class-transformer';

export class TaskUpdateListResponseDTO extends ListPermissionResponseDTO<
  TaskUpdateResponseDTO
> {
  @Type(() => TaskUpdateResponseDTO)
  data: TaskUpdateResponseDTO[];
}
