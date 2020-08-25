import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { TaskUpdateDTO } from './task-update.dto';
import { Type } from 'class-transformer';

export class TaskUpdateEntityDTO extends EntityPermissionResponseDTO<
  TaskUpdateDTO
> {
  @Type(() => TaskUpdateDTO)
  data: TaskUpdateDTO;
}
