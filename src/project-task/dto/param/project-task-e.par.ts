import { IsNumberString } from 'class-validator';
import { ProjectTaskRPar } from './project-task-r.par';

export class ProjectTaskEPar extends ProjectTaskRPar {
  @IsNumberString()
  taskId: number;
}
