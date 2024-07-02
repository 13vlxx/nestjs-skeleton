import { IsEmail } from 'class-validator';
import { SolidPassword } from '../../decorators/solid-password.decorator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @SolidPassword()
  password: string;
}
