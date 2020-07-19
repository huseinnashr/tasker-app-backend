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
import { EmployeeEntity } from '../database/entity';
import { MulterFile } from '../core/interface';
import { FileService } from './file.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { Response } from 'express';
import { FileResponseDTO } from './dto';
import { TransformResponse } from '../core/interceptor';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @TransformResponse(FileResponseDTO)
  async create(
    @UploadedFile() uploadedFile: MulterFile,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<FileResponseDTO> {
    return this.fileService.create(uploadedFile, employee);
  }

  @Get('/:id')
  @Auth()
  // TODO: File buffer response dto fro swagger
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
