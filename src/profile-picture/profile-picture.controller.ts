import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';
import { Auth } from '../core/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureMulter } from './config';
import { ProfilePictureUploadDTO, ProfilePictureEntityDTO } from './dto';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { MulterFile } from '../core/interface';

@Controller('profile-picture')
@ApiTags('Profile Picture')
export class ProfilePictureController {
  constructor(private ppService: ProfilePictureService) {}

  @Post('/')
  @Auth()
  @UseInterceptors(FileInterceptor('profilePicture', ProfilePictureMulter))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ProfilePictureUploadDTO })
  uploadProfilePicture(
    @UploadedFile() uploadedFile: MulterFile,
  ): ProfilePictureEntityDTO {
    return this.ppService.uploadProfilePicture(uploadedFile);
  }
}
