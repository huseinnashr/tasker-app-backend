import * as multer from 'multer';
import * as crypto from 'crypto';
import * as mime from 'mime';
import { Request } from 'express';
import { MulterFile } from '../../core/interface';

export const ProfilePictureDestination = 'upload/profile-picture';
const ProfilePictureStorage: multer.StorageEngine = multer.diskStorage({
  destination: ProfilePictureDestination,
  filename: (
    _: Request,
    file: MulterFile,
    cb: (error: Error, filename?: string) => void,
  ): void => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + '.' + mime.getExtension(file.mimetype));
    });
  },
});

export const ProfilePictureMulter: multer.Options = {
  storage: ProfilePictureStorage,
};
