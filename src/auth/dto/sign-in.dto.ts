import { Expose } from 'class-transformer';
import { CurrentUserDTO } from './current-user.dto';

export class SignInDTO extends CurrentUserDTO {
  @Expose()
  accessToken: string;
}
