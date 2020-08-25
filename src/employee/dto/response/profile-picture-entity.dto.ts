import { ProfilePictureDTO } from './profile-picture.dto';
import { Type, Expose } from 'class-transformer';

export class ProfilePictureEntityDTO {
  @Expose()
  @Type(() => ProfilePictureDTO)
  data: ProfilePictureDTO;
}
