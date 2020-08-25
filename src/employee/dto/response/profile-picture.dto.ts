import { Expose } from 'class-transformer';

export class ProfilePictureDTO {
  @Expose()
  url: string;
}
