import { Expose, Type } from 'class-transformer';
import { FileOwnerResponseDTO } from '.';
import { MimeType } from '../../database/enum';

export class FileResponseDTO {
  @Expose()
  id: number;

  @Expose()
  mime: MimeType;

  @Expose()
  filename: string;

  @Expose()
  @Type(() => FileOwnerResponseDTO)
  owner: FileOwnerResponseDTO;
}
