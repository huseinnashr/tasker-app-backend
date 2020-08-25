import { IsNumberString } from 'class-validator';

export class ProjectTaskListParamDTO {
  @IsNumberString()
  projectId: number;
}

export class ProjectTaskParamDTO extends ProjectTaskListParamDTO {
  @IsNumberString()
  taskId: number;
}
