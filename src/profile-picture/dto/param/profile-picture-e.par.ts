import { IsString } from 'class-validator';

export class ProfilePictureEPar {
  @IsString()
  profilePictureId: string;
}
