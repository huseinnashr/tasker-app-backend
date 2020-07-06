import { IsString, IsEnum } from 'class-validator';
import { Status } from './status.enum';

abstract class ManageProjectDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}

export class CreateProjectDTO extends ManageProjectDTO {}

export class UpdateProjectDTO extends ManageProjectDTO {}

export class ProjectStatusDTO {
  @IsEnum(Status)
  status: Status;
}
