import { Expose, Type } from 'class-transformer';
import { ProjectStatus } from '../../database/enum';
import { ProjectManagerResponseDTO } from './project-manager-response.dto';

export class ProjectResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: ProjectStatus;

  @Expose()
  @Type(() => ProjectManagerResponseDTO)
  manager: ProjectManagerResponseDTO;
}
