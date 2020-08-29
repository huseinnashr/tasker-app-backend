import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { MulterFile } from '../core/interface';
import { ProfilePictureEntityDTO } from './dto';
import { Stream, Readable } from 'stream';
import { promises as fs } from 'fs';
import { MimeType } from '../database/enum';
import { ProfilePictureDestination } from './config';

@Injectable()
export class ProfilePictureService extends AppService {
  upload(uploadedFile: MulterFile): ProfilePictureEntityDTO {
    if (!uploadedFile) throw new BadRequestException('File cannot be empty');

    const url = uploadedFile.filename;

    return this.transform(ProfilePictureEntityDTO, { data: { url } });
  }

  async get(
    profilePictureId: string,
  ): Promise<{ stream: Stream; length: number; mime: MimeType }> {
    const buffer = await fs.readFile(
      `./${ProfilePictureDestination}/${profilePictureId}`,
    );
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return { stream, length: buffer.byteLength, mime: MimeType.JPEG };
  }
}
