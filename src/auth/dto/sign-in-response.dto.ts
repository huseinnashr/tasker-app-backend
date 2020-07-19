import { Expose } from 'class-transformer';
import { CurrentUserResponseDTO } from '.';

export class SignInResponseDTO extends CurrentUserResponseDTO {
  @Expose()
  accessToken: string;
}
