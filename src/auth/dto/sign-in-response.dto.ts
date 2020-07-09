import { Employee } from '../../database/entity';

export interface SignInResponseDTO {
  employee: Employee;
  accessToken: string;
}
