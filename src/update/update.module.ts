import { Module } from '@nestjs/common';
import { UpdateController } from './update.controller';
import { UpdateService } from './update.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository, TaskRepository } from '../database/repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    TypeOrmModule.forFeature([EmployeeRepository]),
    AuthModule,
  ],
  controllers: [UpdateController],
  providers: [UpdateService],
})
export class UpdateModule {}
