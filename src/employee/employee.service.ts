import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entity';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListResponseDTO,
  EmployeeListEntityResponseDTO,
  EmployeeEntityResponseDTO,
} from './dto';
import { AppService } from '../core/app.service';
import { EmployeePermission } from '../shared/permission';

@Injectable()
export class EmployeeService extends AppService {
  constructor(
    @InjectRepository(EmployeeRepository) private empRepo: EmployeeRepository,
    private employeePermission: EmployeePermission,
  ) {
    super();
  }

  async getAll(emp: EmployeeEntity): Promise<EmployeeListResponseDTO> {
    const employees = await this.empRepo.find();

    return this.transform(EmployeeListResponseDTO, {
      data: employees,
      permission: this.employeePermission.getList(null, emp),
    });
  }

  async create(
    createDto: CreateEmployeeDTO,
  ): Promise<EmployeeListEntityResponseDTO> {
    const employee = new EmployeeEntity();
    employee.username = createDto.username;
    employee.role = createDto.role;
    employee.password = createDto.password;
    await this.empRepo.save(employee);

    return this.transform(EmployeeListEntityResponseDTO, { data: employee });
  }

  async get(
    id: number,
    emp: EmployeeEntity,
  ): Promise<EmployeeEntityResponseDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    return this.transform(EmployeeEntityResponseDTO, {
      data: employee,
      permission: this.employeePermission.getEntity(employee, emp),
    });
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeDTO,
  ): Promise<EmployeeListEntityResponseDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    const { username, role, password } = updateDto;

    employee.username = username;
    employee.role = role;

    if (password) {
      employee.password = password;
    }

    await this.empRepo.save(employee);

    return this.transform(EmployeeListEntityResponseDTO, { data: employee });
  }

  async delete(id: number): Promise<void> {
    const employee = await this.empRepo.findOneOrException(id);

    await this.empRepo.remove(employee);
  }
}
