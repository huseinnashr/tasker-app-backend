import { Expose } from 'class-transformer';

export class ProjectTaskStaffDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
