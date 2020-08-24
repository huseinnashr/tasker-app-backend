import { EntityResponseDTO } from '../../shared/dto/entity-response.dto';
import { Type } from 'class-transformer';
import { ManagerProjectResponseDTO } from './manager-project-response.dto';

export class ManagerProjectListEntityResponseDTO extends EntityResponseDTO<
  ManagerProjectResponseDTO
> {
  @Type(() => ManagerProjectResponseDTO)
  data: ManagerProjectResponseDTO;
}
