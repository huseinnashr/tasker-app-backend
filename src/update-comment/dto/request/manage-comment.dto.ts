import { IsString } from 'class-validator';

export class ManageCommentDTO {
  @IsString()
  body: string;
}
