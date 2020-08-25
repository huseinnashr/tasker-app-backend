import { EntityResponseDTO } from '../../../shared/dto';
import { Type } from 'class-transformer';
import { ManagerProjectDTO } from './manager-project.dto';

export class ManagerProjectListEntityDTO extends EntityResponseDTO<
  ManagerProjectDTO
> {
  @Type(() => ManagerProjectDTO)
  data: ManagerProjectDTO;
}
