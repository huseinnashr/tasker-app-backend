import { IsString } from 'class-validator';
export abstract class ManageProjectDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}
