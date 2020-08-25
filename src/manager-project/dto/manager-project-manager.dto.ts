import { Expose } from 'class-transformer';

export class ManagerProjectManagerDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
