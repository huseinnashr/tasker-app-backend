import { Expose } from 'class-transformer';

export class FileOwnerResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
