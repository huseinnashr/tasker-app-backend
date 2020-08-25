import { EntityResponseDTO } from '../../../shared/dto';
import { SignInDTO } from './sign-in.dto';
import { Type } from 'class-transformer';

export class SignInEntityDTO extends EntityResponseDTO<SignInDTO> {
  @Type(() => SignInDTO)
  data: SignInDTO;
}
