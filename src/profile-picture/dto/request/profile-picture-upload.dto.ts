import { ApiProperty } from '@nestjs/swagger';

export class ProfilePictureUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
