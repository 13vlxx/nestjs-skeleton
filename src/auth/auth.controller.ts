import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './_utils/dtos/requests/login-user.dto';
import { RegisterUserDto } from './_utils/dtos/requests/register-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register' })
  customSignUp(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiBadRequestResponse({ description: 'EMAIL_OR_PASSWORD_INCORRECT' })
  @ApiBadRequestResponse({ description: 'PASSWORD_DONT_MATCH' })
  @ApiBadRequestResponse({ description: 'USER_IS_DELETED' })
  customSignIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
