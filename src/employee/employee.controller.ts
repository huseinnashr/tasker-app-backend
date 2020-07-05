import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { Role } from './role.enum';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './employee.dto';
import { Auth } from '../auth/auth.decorator';

@Controller('employee')
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @Auth(Role.ADMIN)
  async getAll(): Promise<Employee[]> {
    return this.empService.getAll();
  }

  @Post('/')
  @Auth(Role.ADMIN)
  async create(@Body() createDto: CreateEmployeeDTO): Promise<Employee> {
    return this.empService.create(createDto);
  }

  @Put('/:id')
  @Auth(Role.ADMIN)
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() employee: UpdateEmployeeDTO,
  ): Promise<Employee> {
    return this.empService.update(id, employee);
  }

  @Delete('/:id')
  @Auth(Role.ADMIN)
  async delete(@Param('id') id: number): Promise<void> {
    return this.empService.delete(id);
  }
}
