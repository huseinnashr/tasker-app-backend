import { Expose } from 'class-transformer';
import { Role } from '../../../database/enum';

export class EmployeeDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  role: Role;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  profilePicture: string;
}
