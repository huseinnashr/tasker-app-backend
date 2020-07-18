import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entity';
import { CreateEmployeeDTO, UpdateEmployeeDTO } from './dto';
import { AppService } from '../core/app.service';

@Injectable()
export class EmployeeService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();
  }

  async getAll(): Promise<EmployeeEntity[]> {
    return this.empRepo.find();
  }

  async create(createDto: CreateEmployeeDTO): Promise<EmployeeEntity> {
    const employee = new EmployeeEntity();
    employee.username = createDto.username;
    employee.role = createDto.role;
    employee.password = createDto.password;
    return this.empRepo.save(employee);
  }

  async get(id: number): Promise<EmployeeEntity> {
    return this.empRepo.findOneOrException(id);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeDTO,
  ): Promise<EmployeeEntity> {
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
