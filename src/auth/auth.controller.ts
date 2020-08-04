import { Controller, Post, Body, HttpCode, Get } from '@nestjs/common';
import {
  SignInDTO,
  SignInEntityResponseDTO,
  CurrentUserEntityResponseDTO,
} from './dto';
import { AuthService } from './auth.service';
import { Auth, CurrentEmployee } from '../core/decorator';
import { EmployeeEntity } from '../database/entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  @HttpCode(200)
  @ApiTags('Authentication')
  async signIn(@Body() signInDto: SignInDTO): Promise<SignInEntityResponseDTO> {
    return this.authService.signIn(signInDto);
  }

  @Get('/current')
  @Auth()
  @ApiTags('Account')
  currentUser(
    @CurrentEmployee() employee: EmployeeEntity,
  ): CurrentUserEntityResponseDTO {
    return this.authService.currentUser(employee);
  }
}
