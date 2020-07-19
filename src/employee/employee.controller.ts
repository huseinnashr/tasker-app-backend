import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  SerializeOptions,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Role } from '../database/enum';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeResponseDTO,
} from './dto';
import { Auth } from '../core/decorator';
import { TransformResponse } from '../core/interceptor';

@Controller('employee')
@SerializeOptions({ groups: ['employee'] })
export class EmployeeController {
  constructor(private empService: EmployeeService) {}

  @Get('/')
  @Auth(Role.ADMIN)
  @TransformResponse(EmployeeResponseDTO)
  async getAll(): Promise<EmployeeResponseDTO[]> {
    return this.empService.getAll();
  }

  @Post('/')
  @Auth(Role.ADMIN)
  @TransformResponse(EmployeeResponseDTO)
  async create(
    @Body() createDto: CreateEmployeeDTO,
  ): Promise<EmployeeResponseDTO> {
    return this.empService.create(createDto);
  }

  @Put('/:id')
  @Auth(Role.ADMIN)
  @TransformResponse(EmployeeResponseDTO)
  async update(
    @Param('id') id: number,
    @Body() employee: UpdateEmployeeDTO,
  ): Promise<EmployeeResponseDTO> {
    return this.empService.update(id, employee);
  }

  @Delete('/:id')
  @Auth(Role.ADMIN)
  async delete(@Param('id') id: number): Promise<void> {
    return this.empService.delete(id);
  }
}
