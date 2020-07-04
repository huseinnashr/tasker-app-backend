import { Controller, Get, UseGuards } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';

@Controller('employee')
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.ADMIN)
  async getAll(): Promise<Employee[]> {
    return this.empService.getAll();
  }
}
