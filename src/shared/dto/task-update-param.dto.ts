import { IsNumberString } from 'class-validator';
import { ProjectTaskParamDTO } from '.';

export class TaskUpdateParamDTO extends ProjectTaskParamDTO {
  @IsNumberString()
  updateId: number;
}
