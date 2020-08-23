import { Injectable, BadRequestException } from '@nestjs/common';
import { EmployeeRepository } from '../database/repository';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from '../database/entity';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  EmployeeListResponseDTO,
  EmployeeListEntityResponseDTO,
  EmployeeEntityResponseDTO,
  ProfilePictureEntityResponseDTO,
} from './dto';
import { AppService } from '../core/app.service';
import { EmployeePermission } from '../shared/permission';
import { MulterFile } from '../core/interface';

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
    employee.firstName = createDto.firstName;
    employee.lastName = createDto.lastName;
    employee.email = createDto.email;
    employee.profilePicture = createDto.profilePicture;
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

    return this.transform(EmployeeListEntityResponseDTO, { data: employee });
  }

  async delete(id: number): Promise<void> {
    const employee = await this.empRepo.findOneOrException(id);

    await this.empRepo.remove(employee);
  }

  uploadProfilePicture(
    uploadedFile: MulterFile,
  ): ProfilePictureEntityResponseDTO {
    if (!uploadedFile) throw new BadRequestException('File cannot be empty');

    const url = uploadedFile.filename;

    return this.transform(ProfilePictureEntityResponseDTO, { data: { url } });
  }
}
