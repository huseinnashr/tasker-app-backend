import { IsNumberString } from 'class-validator';
import { ManagerParamDTO } from './manager-param.dto';

export class ProjectParamDTO extends ManagerParamDTO {
  @IsNumberString()
  projectId: number;
}
