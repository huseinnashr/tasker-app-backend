import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File, Employee } from '../database/entity';
import { MulterFile } from '../core/interface';
import { FileService } from './file.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() uploadedFile: MulterFile,
    @CurrentEmployee() employee: Employee,
  ): Promise<File> {
    return this.fileService.create(uploadedFile, employee);
  }

  @Get('/:id')
  @Auth()
  async get(
    @Param('id') fileId: number,
    @CurrentEmployee() employee: Employee,
    @Res() res: Response,
  ): Promise<void> {
    const file = await this.fileService.get(fileId, employee);
    res.setHeader('Content-Type', file.mime);
    res.setHeader('Content-Length', file.length);

    file.stream.pipe(res);
  }
}
