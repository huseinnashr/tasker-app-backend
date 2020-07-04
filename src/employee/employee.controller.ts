import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';
import { CreateEmployeeDTO } from './employee.dto';

@Controller('employee')
@UseGuards(AuthGuard(), RolesGuard)
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @Roles(Role.ADMIN)
  async getAll(): Promise<Employee[]> {
    return this.empService.getAll();
  }

  @Post('/')
  @Roles(Role.ADMIN)
  async create(@Body() createDto: CreateEmployeeDTO): Promise<Employee> {
    return this.empService.create(createDto);
  }
}
