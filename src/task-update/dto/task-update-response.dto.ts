import { Expose, Type } from 'class-transformer';
import { UpdateType } from '../../database/enum';
import { TaskUpdateFilesResponseDTO } from '.';

export class TaskUpdateResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  type: UpdateType;

  @Expose()
  @Type(() => TaskUpdateFilesResponseDTO)
  files: TaskUpdateFilesResponseDTO[];
}
