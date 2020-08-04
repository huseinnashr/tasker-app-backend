import { Expose } from 'class-transformer';
import { CurrentUserResponseDTO } from './current-user-response.dto';

export class SignInResponseDTO extends CurrentUserResponseDTO {
  @Expose()
  accessToken: string;
}
