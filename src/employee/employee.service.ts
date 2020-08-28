import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entity';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListDTO,
  EmployeeListEntityDTO,
  EmployeeEntityDTO,
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

  async getAll(emp: EmployeeEntity): Promise<EmployeeListDTO> {
    const employees = await this.empRepo.find();

    return this.transform(EmployeeListDTO, {
      data: employees,
      permission: this.employeePermission.getList(null, emp),
    });
  }

  async create(createDto: CreateEmployeeDTO): Promise<EmployeeListEntityDTO> {
    const employee = new EmployeeEntity();
    employee.username = createDto.username;
    employee.firstName = createDto.firstName;
    employee.lastName = createDto.lastName;
    employee.email = createDto.email;
    employee.profilePicture = createDto.profilePicture;
    employee.role = createDto.role;
    employee.password = createDto.password;
    await this.empRepo.save(employee);

    return this.transform(EmployeeListEntityDTO, { data: employee });
  }

  async get(id: number, emp: EmployeeEntity): Promise<EmployeeEntityDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    return this.transform(EmployeeEntityDTO, {
      data: employee,
      permission: this.employeePermission.getEntity(employee, emp),
    });
  }

  async update(
    id: number,
    updateDto: UpdateEmployeeDTO,
  ): Promise<EmployeeListEntityDTO> {
    const employee = await this.empRepo.findOneOrException(id);

    employee.username = updateDto.username;
    employee.firstName = updateDto.firstName;
    employee.lastName = updateDto.lastName;
    employee.email = updateDto.email;
    employee.profilePicture = updateDto.profilePicture;
    employee.role = updateDto.role;

    if (updateDto.password) {
      employee.password = updateDto.password;
    }

    await this.empRepo.save(employee);

    return this.transform(EmployeeListEntityDTO, { data: employee });
  }

  async delete(id: number): Promise<void> {
    const employee = await this.empRepo.findOneOrException(id);

    await this.empRepo.remove(employee);
  }
}
