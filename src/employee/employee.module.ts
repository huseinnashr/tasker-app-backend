import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from '../database/repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRepository]), AuthModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [],
})
export class EmployeeModule {}
