import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../database/enum';
import { ProjectTaskStaffResponseDTO } from '.';

export class ProjectTaskResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: TaskStatus;

  @Expose()
  @Type(() => ProjectTaskStaffResponseDTO)
  staff: ProjectTaskStaffResponseDTO;
}
