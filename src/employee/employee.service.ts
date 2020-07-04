import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './employee.dto';

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

  async get(id: number): Promise<Employee> {
    const employee = await this.empRepo.findOne(id);

    if (!employee) {
      throw new NotFoundException(`Employee with id:${id} was not found`);
    }

    return employee;
  }

  async update(id: number, updateDto: UpdateEmployeeDTO): Promise<Employee> {
    const employee = await this.get(id);

    const { username, role, password } = updateDto;

    employee.username = username;
    employee.role = role;
    employee.setPassword(password);

    await this.empRepo.save(employee);

    return employee;
  }
}
