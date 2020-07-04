import { EntityRepository, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDTO } from './employee.dto';

@EntityRepository(Employee)
export class EmployeeRepository extends Repository<Employee> {
  async createAndSave(createEmployeeDTO: CreateEmployeeDTO): Promise<Employee> {
    const employee = new Employee();
    employee.username = createEmployeeDTO.username;
    employee.role = createEmployeeDTO.role;
    await employee.setPassword(createEmployeeDTO.password);
    await this.manager.save(employee);
    return employee;
  }
}
