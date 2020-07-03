import { Controller, Get, UseGuards } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('employee')
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  async getAll(): Promise<Employee[]> {
    return this.empService.getAll();
  }
}
