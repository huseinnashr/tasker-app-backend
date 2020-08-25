import { EntityResponseDTO } from '../../../shared/dto';
import { CurrentUserDTO } from './current-user.dto';
import { Type } from 'class-transformer';

export class CurrentUserEntityDTO extends EntityResponseDTO<CurrentUserDTO> {
  @Type(() => CurrentUserDTO)
  data: CurrentUserDTO;
}
