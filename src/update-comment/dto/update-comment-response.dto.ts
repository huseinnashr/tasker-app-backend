import { Expose, Type } from 'class-transformer';
import { UpdateCommentCreatorResponseDTO } from '.';

export class UpdateCommentResponseDTO {
  @Expose()
  id: number;

  @Expose()
  body: string;

  @Expose()
  @Type(() => UpdateCommentCreatorResponseDTO)
  creator: UpdateCommentCreatorResponseDTO;
}
