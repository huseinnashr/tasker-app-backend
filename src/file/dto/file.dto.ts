import { Expose, Type } from 'class-transformer';
import { FileOwnerDTO } from '.';
import { MimeType } from '../../database/enum';

export class FileDTO {
  @Expose()
  id: number;

  @Expose()
  mime: MimeType;

  @Expose()
  filename: string;

  @Expose()
  @Type(() => FileOwnerDTO)
  owner: FileOwnerDTO;
}
