import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { TaskUpdateResponseDTO } from './task-update-response.dto';
import { Type } from 'class-transformer';

export class TaskUpdateListEntityResponseDTO extends EntityResponseDTO<
  TaskUpdateResponseDTO
> {
  @Type(() => TaskUpdateResponseDTO)
  data: TaskUpdateResponseDTO;
}
