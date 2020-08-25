import { Expose } from 'class-transformer';

export class ManagerProjectStatsDTO {
  @Expose()
  total: number;

  @Expose()
  completed: number;
}
