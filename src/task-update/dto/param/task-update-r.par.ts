import { IsNumberString } from 'class-validator';

export class TaskUpdateRPar {
  @IsNumberString()
  projectId: number;

  @IsNumberString()
  taskId: number;
}
