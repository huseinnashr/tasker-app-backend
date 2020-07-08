import { Employee } from '../../employee/employee.entity';

export interface SignInResponseDTO {
  employee: Employee;
  accessToken: string;
}
