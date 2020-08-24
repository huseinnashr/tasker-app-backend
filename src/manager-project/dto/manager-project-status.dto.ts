import { IsEnum } from 'class-validator';
import { ProjectStatus } from '../../database/enum';

export class ManagerProjectStatusDTO {
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}
