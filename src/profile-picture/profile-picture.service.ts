import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { MulterFile } from '../core/interface';
import { ProfilePictureEntityDTO } from './dto';

@Injectable()
export class ProfilePictureService extends AppService {
  uploadProfilePicture(uploadedFile: MulterFile): ProfilePictureEntityDTO {
    if (!uploadedFile) throw new BadRequestException('File cannot be empty');

    const url = uploadedFile.filename;

    return this.transform(ProfilePictureEntityDTO, { data: { url } });
  }
}
