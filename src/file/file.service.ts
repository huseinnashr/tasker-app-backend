import { Injectable, BadRequestException } from '@nestjs/common';
import { AppService } from '../core/app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from '../database/repository';
import { MulterFile } from '../core/interface';
import { FileEntity, EmployeeEntity } from '../database/entity';
import { MimeType } from '../database/enum';
import { promises as fs } from 'fs';
import { Readable, Stream } from 'stream';
import { FileEntityDTO } from './dto';
import { FilePermission } from '../shared/permission';

@Injectable()
export class FileService extends AppService {
  constructor(
    @InjectRepository(FileRepository) private fileRepo: FileRepository,
    private filePermission: FilePermission,
  ) {
    super();
  }

  async create(
    uploadedFile: MulterFile,
    employee: EmployeeEntity,
  ): Promise<FileEntityDTO> {
    if (!uploadedFile) throw new BadRequestException('File cannot be empty');

    const file = new FileEntity();
    file.filename = uploadedFile.originalname;
    file.mime = <MimeType>uploadedFile.mimetype;
    file.filepath = uploadedFile.path;
    file.owner = employee;

    await this.fileRepo.save(file);

    return this.transform(FileEntityDTO, { data: file });
  }

  async get(
    fileId: number,
    employee: EmployeeEntity,
  ): Promise<{ stream: Stream; length: number; mime: MimeType }> {
    const file = await this.fileRepo.findOneOrException(fileId, {
      relations: [
        'update',
        'update.task',
        'update.task.project',
        'update.task.project.tasks',
      ],
    });

    this.canView(this.filePermission.read(file, employee), 'file');

    const buffer = await fs.readFile(file.filepath);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return { stream, length: buffer.byteLength, mime: file.mime };
  }
}
