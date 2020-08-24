import { Type } from 'class-transformer';
import { ListPermissionResponseDTO } from '../../shared/dto';
import { ManagerProjectResponseDTO } from './manager-project-response.dto';

export class ManagerProjectListResponseDTO extends ListPermissionResponseDTO<
  ManagerProjectResponseDTO
> {
  @Type(() => ManagerProjectResponseDTO)
  data: ManagerProjectResponseDTO[];
}
