import { Expose } from 'class-transformer';

export class ProjectManagerResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
