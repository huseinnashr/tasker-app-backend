import { Expose } from 'class-transformer';

export class UpdateCommentCreatorResponseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
