import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SignInDTO } from './auth.dto';
import { Employee } from '../employee/employee.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDTO): Promise<Employee> {
    return this.authService.signIn(signInDto);
  }
}
