import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  SerializeOptions,
} from '@nestjs/common';
import { SignInDTO, SignInResponseDTO } from './dto';
import { AuthService } from './auth.service';
import { CurrentEmployee, Auth } from './auth.decorator';
import { Employee } from '../employee/employee.entity';

@Controller('auth')
@SerializeOptions({ groups: ['auth'] })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.signIn(signInDto);
  }

  @Get('/current')
  @Auth()
  currentUser(@CurrentEmployee() employee: Employee): Employee {
    return employee;
  }
}
