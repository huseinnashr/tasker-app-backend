import { EntityResponseDTO } from '../../../shared/dto';
import { Type } from 'class-transformer';
import { ManagerDTO } from './manager.dto';

export class ManagerEntityDTO extends EntityResponseDTO<ManagerDTO> {
  @Type(() => ManagerDTO)
  data: ManagerDTO;
}
