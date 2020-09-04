import { IsNumberString } from 'class-validator';

export class TaskArtifactRPar {
  @IsNumberString()
  projectId: number;

  @IsNumberString()
  taskId: number;
}
