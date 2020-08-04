import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from '../database/repository';
import { AuthModule } from '../auth/auth.module';
import { EmployeePermission } from '../shared/permission';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRepository]), AuthModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeePermission],
})
export class EmployeeModule {}
