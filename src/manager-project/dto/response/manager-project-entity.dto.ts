import { Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from '../../../shared/dto';
import { ManagerProjectDTO } from './manager-project.dto';

export class ManagerProjectEntityDTO extends EntityPermissionResponseDTO<
  ManagerProjectDTO
> {
  @Type(() => ManagerProjectDTO)
  data: ManagerProjectDTO;
}
