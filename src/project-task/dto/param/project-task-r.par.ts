import { IsNumberString } from 'class-validator';

export class ProjectTaskRPar {
  @IsNumberString()
  projectId: number;
}
