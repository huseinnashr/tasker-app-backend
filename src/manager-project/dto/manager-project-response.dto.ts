import { Expose, Type } from 'class-transformer';
import { ProjectStatus } from '../../database/enum';
import { ManagerProjectManagerResponseDTO } from './manager-project-manager-response.dto';

export class ManagerProjectResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: ProjectStatus;

  @Expose()
  @Type(() => ManagerProjectManagerResponseDTO)
  manager: ManagerProjectManagerResponseDTO;
}
