import { IsNumber } from 'class-validator';

export class AssignUpdateDTO {
  @IsNumber()
  updateId: number;
}
