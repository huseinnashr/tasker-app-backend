import { IsString, IsNumber } from 'class-validator';

export class ManageTaskDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsNumber()
  employeeId: number;
}

export class CreateTaskDTO extends ManageTaskDTO {}
export class UpdateTaskDTO extends ManageTaskDTO {}
