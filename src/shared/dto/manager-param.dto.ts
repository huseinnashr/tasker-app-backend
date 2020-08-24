import { IsNumberString } from 'class-validator';

export class ManagerParamDTO {
  @IsNumberString()
  managerId: number;
}
