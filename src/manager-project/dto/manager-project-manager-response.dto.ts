import { Expose } from 'class-transformer';

export class ManagerProjectManagerResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
