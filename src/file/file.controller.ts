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
import { ApiTags, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileUploadDTO } from './dto/file-upload.dto';
import { MimeType } from '../database/enum';

@Controller('file')
@ApiTags('File Upload')
export class FileController {
  constructor(private fileService: FileService) {}

  @Post('/')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  async create(
    @UploadedFile() uploadedFile: MulterFile,
    @CurrentEmployee() employee: EmployeeEntity,
  ): Promise<FileResponseDTO> {
    return this.fileService.create(uploadedFile, employee);
  }

  @Get('/:id')
  @Auth()
  @ApiOkResponse({
    content: {
      [MimeType.DOCX]: {},
      [MimeType.JPEG]: {},
      [MimeType.PNG]: {},
      [MimeType.PDF]: {},
    },
  })
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
