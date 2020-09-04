import { IsNumberString } from 'class-validator';
import { TaskArtifactRPar } from './task-artifact-r.par';

export class TaskArtifactEPar extends TaskArtifactRPar {
  @IsNumberString()
  artifactId: number;
}
