import { Expose } from 'class-transformer';
import { MimeType } from '../../../database/enum';

export class TaskUpdateFilesDTO {
  @Expose()
  id: number;

  @Expose()
  mime: MimeType;

  @Expose()
  filename: string;
}
