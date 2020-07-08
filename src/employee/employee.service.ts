import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './employee.dto';
import { AppService } from '../core/app.service';

@Injectable()
export class EmployeeService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();
  }

  async getAll(): Promise<Employee[]> {
    return this.empRepo.find();
  }

  async create(createDto: CreateEmployeeDTO): Promise<Employee> {
    const employee = new Employee();
    employee.username = createDto.username;
    employee.role = createDto.role;
    employee.password = createDto.password;
    return this.empRepo.save(employee);
  }

  async get(id: number): Promise<Employee> {
    return this.empRepo.findOneOrException(id);
  }

  async update(id: number, updateDto: UpdateEmployeeDTO): Promise<Employee> {
    const employee = await this.empRepo.findOneOrException(id);

    const { username, role, password } = updateDto;

    employee.username = username;
    employee.role = role;

    if (password) {
      employee.password = password;
    }

    await this.empRepo.save(employee);

    return employee;
  }

  async delete(id: number): Promise<void> {
    const employee = await this.empRepo.findOneOrException(id);

    await this.empRepo.remove(employee);
  }
}
