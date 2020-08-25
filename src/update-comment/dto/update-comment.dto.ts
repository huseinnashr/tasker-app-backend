import { Expose, Type } from 'class-transformer';
import { UpdateCommentCreatorDTO } from '.';

export class UpdateCommentDTO {
  @Expose()
  id: number;

  @Expose()
  body: string;

  @Expose()
  @Type(() => UpdateCommentCreatorDTO)
  creator: UpdateCommentCreatorDTO;
}
