import { Type } from 'class-transformer';
import { ListPermissionResponseDTO } from '../../../shared/dto';
import { ManagerProjectDTO } from './manager-project.dto';

export class ManagerProjectListDTO extends ListPermissionResponseDTO<
  ManagerProjectDTO
> {
  @Type(() => ManagerProjectDTO)
  data: ManagerProjectDTO[];
}
