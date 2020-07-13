import { MulterModuleOptions } from '@nestjs/platform-express';
import { MulterFile } from '../core/interface';
import { MimeType } from '../database/enum';

const acceptedMimes = [
  MimeType.DOCX,
  MimeType.JPEG,
  MimeType.PNG,
  MimeType.PDF,
];

export const MulterConfig: MulterModuleOptions = {
  dest: './upload',
  fileFilter: (_, file: MulterFile, callback) => {
    if (acceptedMimes.includes(<MimeType>file.mimetype)) {
      return callback(null, true);
    }
    return callback(new Error('Only Image, PDF or Docx allowed'), false);
  },
};
