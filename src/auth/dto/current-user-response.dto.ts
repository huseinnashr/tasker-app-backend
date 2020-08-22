import { Expose } from 'class-transformer';
import { Role } from '../../database/enum';

export class CurrentUserResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: Role;

  @Expose()
  email: string;

  @Expose()
  profile_picture: string;
}
