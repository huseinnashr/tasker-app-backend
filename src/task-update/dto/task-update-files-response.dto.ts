import { Expose } from 'class-transformer';
import { MimeType } from '../../database/enum';

export class TaskUpdateFilesResponseDTO {
  @Expose()
  id: number;

  @Expose()
  mime: MimeType;

  @Expose()
  filename: string;
}
