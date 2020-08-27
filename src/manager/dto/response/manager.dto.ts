import { Expose, Type } from 'class-transformer';
import { ManagerProjectStatsDTO } from './manager-project-stats.dto';

export class ManagerDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  profilePicture: string;

  @Expose()
  @Type(() => ManagerProjectStatsDTO)
  projectStats: ManagerProjectStatsDTO;
}
