import { Type } from 'class-transformer';
import { EntityPermissionResponseDTO } from '../../shared/dto';
import { ManagerProjectResponseDTO } from './manager-project-response.dto';

export class ManagerProjectEntityResponseDTO extends EntityPermissionResponseDTO<
  ManagerProjectResponseDTO
> {
  @Type(() => ManagerProjectResponseDTO)
  data: ManagerProjectResponseDTO;
}
