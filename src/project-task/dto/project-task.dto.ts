import { Expose, Type } from 'class-transformer';
import { TaskStatus } from '../../database/enum';
import { ProjectTaskStaffDTO } from './project-task-staff.dto';

export class ProjectTaskDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  status: TaskStatus;

  @Expose()
  @Type(() => ProjectTaskStaffDTO)
  staff: ProjectTaskStaffDTO;
}
