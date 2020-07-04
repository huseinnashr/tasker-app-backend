import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDTO } from './employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {}

  async getAll(): Promise<Employee[]> {
    return this.empRepo.find();
  }

  async create(createDto: CreateEmployeeDTO): Promise<Employee> {
    return this.empRepo.createAndSave(createDto);
  }
}
