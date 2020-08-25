import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { Role } from '../../../database/enum';
export abstract class ManageEmployeeDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password?: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  profilePicture: string;
}
