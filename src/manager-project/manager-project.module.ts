import { Module } from '@nestjs/common';
import { ManagerProjectController } from './manager-project.controller';
import { ManagerProjectService } from './manager-project.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectRepository } from '../database/repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPermission } from '../shared/permission';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository]), AuthModule],
  controllers: [ManagerProjectController],
  providers: [ManagerProjectService, ProjectPermission],
})
export class ManagerProjectModule {}
