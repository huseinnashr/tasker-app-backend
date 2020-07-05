import { IsString } from 'class-validator';

abstract class ManageProjectDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}

export class CreateProjectDTO extends ManageProjectDTO {}

export class UpdateProjectDTO extends ManageProjectDTO {}
