import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '../database/repository';
import { MulterFile } from '../core/interface';
import { File, Employee } from '../database/entity';
import { MimeType } from '../database/enum';
import { promises as fs } from 'fs';
import { Readable, Stream } from 'stream';

@Injectable()
export class FileService extends AppService {
  constructor(
    @InjectRepository(FileRepository) private fileRepo: FileRepository,
  ) {
    super();
  }

  async create(uploadedFile: MulterFile, employee: Employee): Promise<File> {
    if (!uploadedFile) throw new BadRequestException('File cannot be empty');

    const file = new File();
    file.filename = uploadedFile.originalname;
    file.mime = <MimeType>uploadedFile.mimetype;
    file.filepath = uploadedFile.path;
    file.owner = employee;

    return this.fileRepo.save(file);
  }

  async get(
    fileId: number,
    employee: Employee,
  ): Promise<{ stream: Stream; length: number; mime: MimeType }> {
    const file = await this.fileRepo.findOneOrException(fileId);

    this.canView(file.isOwner(employee), 'file');

    const buffer = await fs.readFile(file.filepath);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return { stream, length: buffer.byteLength, mime: file.mime };
  }
}
