import { Expose } from 'class-transformer';

export class UpdateCommentCreatorDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;
}
