import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../../database/enum';

export class ProjectStatusDTO {
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
