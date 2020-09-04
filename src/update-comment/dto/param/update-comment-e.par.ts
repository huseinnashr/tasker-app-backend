import { IsNumberString } from 'class-validator';
import { UpdateCommentRPar } from './update-comment-r.par';

export class UpdateCommentEPar extends UpdateCommentRPar {
  @IsNumberString()
  commentId: number;
}
