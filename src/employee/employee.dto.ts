import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from './role.enum';

abstract class ManagemEmployeeDTO {
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
}

export class CreateEmployeeDTO extends ManagemEmployeeDTO {
  password: string;
}

export class UpdateEmployeeDTO extends ManagemEmployeeDTO {
  @IsOptional()
  password?: string;
}
