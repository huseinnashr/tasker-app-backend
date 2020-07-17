import { IsNumberString } from 'class-validator';

export class ProjectParamDTO {
  @IsNumberString()
  projectId: number;
}
