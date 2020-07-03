import { IsString } from 'class-validator';
import { Employee } from '../employee/employee.entity';

export interface JwtPayload {
  username: string;
}

export class SignInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export interface SignInResponseDTO {
  employee: Employee;
  accessToken: string;
}
