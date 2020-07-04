import { EmployeeRepository } from '../src/employee/employee.repository';
import { JwtService } from '@nestjs/jwt';

interface signUpDto {
  username: string;
}

const signUp = async (
  empRepo: EmployeeRepository,
  jwtService: JwtService,
  data: signUpDto,
) => {
  const employee = await empRepo.createAndSave({
    username: data.username,
    password: 'SecretPassword1234',
  });
  const accessToken = jwtService.sign({ username: data.username });

  return [`Bearer ${accessToken}`, employee];
};

export { signUp };
