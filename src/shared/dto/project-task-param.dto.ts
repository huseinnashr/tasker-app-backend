import { IsNumberString } from 'class-validator';
import { ProjectParamDTO } from '.';

export class ProjectTaskParamDTO extends ProjectParamDTO {
  @IsNumberString()
  taskId: number;
}
