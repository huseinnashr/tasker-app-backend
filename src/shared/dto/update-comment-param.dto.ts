import { IsNumberString } from 'class-validator';
import { TaskUpdateParamDTO } from '.';

export class UpdateCommentParamDTO extends TaskUpdateParamDTO {
  @IsNumberString()
  commentId: number;
}
