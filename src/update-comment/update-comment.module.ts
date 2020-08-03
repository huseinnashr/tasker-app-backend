import { Module } from '@nestjs/common';
import { UpdateCommentController } from './update-comment.controller';
import { UpdateCommentService } from './update-comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateRepository, CommentRepository } from '../database/repository';
import { AuthModule } from '../auth/auth.module';
import { CommentPermission } from '../shared/permission';

@Module({
  imports: [
    TypeOrmModule.forFeature([UpdateRepository]),
    TypeOrmModule.forFeature([CommentRepository]),
    AuthModule,
  ],
  controllers: [UpdateCommentController],
  providers: [UpdateCommentService, CommentPermission],
})
export class UpdateCommentModule {}
