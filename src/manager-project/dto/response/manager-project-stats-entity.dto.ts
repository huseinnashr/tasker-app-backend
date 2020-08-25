import { Type } from 'class-transformer';
import { EntityResponseDTO } from '../../../shared/dto';
import { ManagerProjectStatsDTO } from './manager-project-stats.dto';

export class ManagerProjectStatsEntityDTO extends EntityResponseDTO<
  ManagerProjectStatsDTO
> {
  @Type(() => ManagerProjectStatsDTO)
  data: ManagerProjectStatsDTO;
}
