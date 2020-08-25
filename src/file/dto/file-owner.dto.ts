import { Expose } from 'class-transformer';

export class FileOwnerDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
