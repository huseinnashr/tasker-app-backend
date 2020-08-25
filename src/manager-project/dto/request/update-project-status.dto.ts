import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../database/enum';

export class UpdateProjectStatusDTO {
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
