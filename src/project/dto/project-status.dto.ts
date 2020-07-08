import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../project-status.enum';

export class ProjectStatusDTO {
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
