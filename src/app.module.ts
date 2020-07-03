import { Module, ValidationPipe } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), AuthModule, EmployeeModule],
  providers: [{ provide: 'APP_PIPE', useClass: ValidationPipe }],
})
export class AppModule {}
