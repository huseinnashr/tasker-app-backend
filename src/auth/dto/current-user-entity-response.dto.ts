import { EntityResponseDTO } from '../../shared/dto';
import { CurrentUserResponseDTO } from './current-user-response.dto';
import { Type } from 'class-transformer';

export class CurrentUserEntityResponseDTO extends EntityResponseDTO<
  CurrentUserResponseDTO
> {
  @Type(() => CurrentUserResponseDTO)
  data: CurrentUserResponseDTO;
}
