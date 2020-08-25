import { IsString } from 'class-validator';

export class DoSignInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
