import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { SignInDTO, SignInResponseDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { CurrentEmployee } from './auth.decorator';
import { Employee } from '../employee/employee.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  signIn(@Body() signInDto: SignInDTO): Promise<SignInResponseDTO> {
    return this.authService.signIn(signInDto);
  }

  @Get('/current')
  @UseGuards(AuthGuard())
  currentUser(@CurrentEmployee() employee: Employee): Employee {
    return employee;
  }
}
