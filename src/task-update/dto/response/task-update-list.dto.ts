import { ListPermissionResponseDTO } from '../../../shared/dto';
import { TaskUpdateDTO } from './task-update.dto';
import { Type } from 'class-transformer';

export class TaskUpdateListDTO extends ListPermissionResponseDTO<
  TaskUpdateDTO
> {
  @Type(() => TaskUpdateDTO)
  data: TaskUpdateDTO[];
}
