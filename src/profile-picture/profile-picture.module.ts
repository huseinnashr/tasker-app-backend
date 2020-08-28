import { Module } from '@nestjs/common';
import { ProfilePictureController } from './profile-picture.controller';
import { ProfilePictureService } from './profile-picture.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfilePictureController],
  providers: [ProfilePictureService],
})
export class ProfilePictureModule {}
