import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../database/enum';
import { ProjectTaskStaffResponseDTO } from '.';
import { ListResponseDTO } from '../../shared/dto';

export class ProjectTaskListResponseDTO extends ListResponseDTO<
  ProjectTaskResponseDTO
> {
  @Expose()
  @Type(() => ProjectTaskResponseDTO)
  data: ProjectTaskResponseDTO[];
}

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
