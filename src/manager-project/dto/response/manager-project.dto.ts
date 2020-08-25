import { Expose, Type } from 'class-transformer';
import { ProjectStatus } from '../../../database/enum';
import { ManagerProjectManagerDTO } from './manager-project-manager.dto';

export class ManagerProjectDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: ProjectStatus;

  @Expose()
  @Type(() => ManagerProjectManagerDTO)
  manager: ManagerProjectManagerDTO;
}
