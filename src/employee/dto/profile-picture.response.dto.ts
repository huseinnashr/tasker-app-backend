import { Expose } from 'class-transformer';

export class ProfilePictureResponseDTO {
  @Expose()
  url: string;
}
