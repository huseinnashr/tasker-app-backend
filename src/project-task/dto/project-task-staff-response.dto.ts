import { Expose } from 'class-transformer';

export class ProjectTaskStaffResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
