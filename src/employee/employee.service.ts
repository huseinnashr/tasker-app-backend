import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entity';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeResponseDTO,
} from './dto';
import { AppService } from '../core/app.service';

@Injectable()
export class EmployeeService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
  ) {
    super();
  }

  async getAll(): Promise<EmployeeResponseDTO[]> {
    const employees = await this.empRepo.find();

    return this.transform(EmployeeResponseDTO, employees);
  }

  async create(createDto: CreateEmployeeDTO): Promise<EmployeeResponseDTO> {
    const employee = new EmployeeEntity();
    employee.username = createDto.username;
    employee.role = createDto.role;
    employee.password = createDto.password;
    await this.empRepo.save(employee);

    return this.transform(EmployeeResponseDTO, employee);
  }

  async get(id: number): Promise<EmployeeResponseDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    return this.transform(EmployeeResponseDTO, employee);
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeDTO,
  ): Promise<EmployeeResponseDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    const { username, role, password } = updateDto;

    employee.username = username;
    employee.role = role;

    if (password) {
      employee.password = password;
    }

    await this.empRepo.save(employee);

    return this.transform(EmployeeResponseDTO, employee);
  }

  async delete(id: number): Promise<void> {
    const employee = await this.empRepo.findOneOrException(id);

    await this.empRepo.remove(employee);
  }
}
