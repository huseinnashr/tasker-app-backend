import { EntityResponseDTO } from '../../shared/dto';
import { SignInResponseDTO } from './sign-in-response.dto';
import { Type } from 'class-transformer';

export class SignInEntityResponseDTO extends EntityResponseDTO<
  SignInResponseDTO
> {
  @Type(() => SignInResponseDTO)
  data: SignInResponseDTO;
}
