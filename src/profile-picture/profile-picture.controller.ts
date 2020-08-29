import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ProfilePictureService } from './profile-picture.service';
import { Auth } from '../core/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureMulter } from './config';
import { ProfilePictureUploadDTO, ProfilePictureEntityDTO } from './dto';
import { ApiConsumes, ApiBody, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { MulterFile } from '../core/interface';
import { MimeType } from '../database/enum';
import { Response } from 'express';

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
    return this.ppService.upload(uploadedFile);
  }

  @Get('/:profilePictureId')
  @ApiOkResponse({
    content: {
      [MimeType.JPEG]: {},
    },
  })
  async get(
    @Param('profilePictureId') profilePictureId: string,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.ppService.get(profilePictureId);
    res.setHeader('Content-Type', file.mime);
    res.setHeader('Content-Length', file.length);

    file.stream.pipe(res);
  }
}
