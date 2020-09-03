import { IsNumberString } from 'class-validator';

export class ManagerEntityParDTO {
  @IsNumberString()
  managerId: number;
}
