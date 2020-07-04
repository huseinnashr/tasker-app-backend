import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../src/employee/role.enum';

interface signUpDto {
  username: string;
  role: Role;
}

const signUp = async (
  empRepo: EmployeeRepository,
  jwtService: JwtService,
  data: signUpDto,
) => {
  const employee = await empRepo.createAndSave({
    ...data,
    password: 'SecretPassword1234',
  });
  const accessToken = jwtService.sign({ username: data.username });

  return [`Bearer ${accessToken}`, employee];
};

export { signUp };
