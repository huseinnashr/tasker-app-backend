import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRepository } from '../database/repository';
import { AuthModule } from '../auth/auth.module';
import { MulterConfig } from '../config/multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(MulterConfig),
    TypeOrmModule.forFeature([FileRepository]),
    AuthModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
