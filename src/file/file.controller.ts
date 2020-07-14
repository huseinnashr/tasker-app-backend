import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileEntity, EmployeeEntity } from '../database/entity';
import { MulterFile } from '../core/interface';
import { FileService } from './file.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Response } from 'express';

@Controller('file')
@SerializeOptions({ groups: ['file'] })
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() uploadedFile: MulterFile,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<FileEntity> {
    return this.fileService.create(uploadedFile, employee);
  }

  @Get('/:id')
  @Auth()
  async get(
    @Param('id') fileId: number,
    @CurrentEmployee() employee: EmployeeEntity,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.fileService.get(fileId, employee);
    res.setHeader('Content-Type', file.mime);
    res.setHeader('Content-Length', file.length);

    file.stream.pipe(res);
  }
}
