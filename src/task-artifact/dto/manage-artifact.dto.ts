import { IsString } from 'class-validator';

export class ManageArtifactDTO {
  @IsString()
  description: string;
}
