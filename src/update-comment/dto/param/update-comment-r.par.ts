import { IsNumberString } from 'class-validator';

export class UpdateCommentRPar {
  @IsNumberString()
  projectId: number;

  @IsNumberString()
  taskId: number;

  @IsNumberString()
  updateId: number;
}
