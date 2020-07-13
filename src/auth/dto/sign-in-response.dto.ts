import { EmployeeEntity } from '../../database/entity';

export interface SignInResponseDTO {
  employee: EmployeeEntity;
  accessToken: string;
}
