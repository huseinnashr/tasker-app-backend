import { IsNumberString } from 'class-validator';
import { ProjectTaskParamDTO } from '.';

export class TaskArtifactParamDTO extends ProjectTaskParamDTO {
  @IsNumberString()
  artifactId: number;
}
