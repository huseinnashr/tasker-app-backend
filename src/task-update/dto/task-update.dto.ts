import { Expose, Type } from 'class-transformer';
import { UpdateType } from '../../database/enum';
import { TaskUpdateFilesDTO } from '.';

export class TaskUpdateDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  type: UpdateType;

  @Expose()
  @Type(() => TaskUpdateFilesDTO)
  files: TaskUpdateFilesDTO[];
}
