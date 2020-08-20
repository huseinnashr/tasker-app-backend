import { ProfilePictureResponseDTO } from './profile-picture.response.dto';
import { Type, Expose } from 'class-transformer';

export class ProfilePictureEntityResponseDTO {
  @Expose()
  @Type(() => ProfilePictureResponseDTO)
  data: ProfilePictureResponseDTO;
}
