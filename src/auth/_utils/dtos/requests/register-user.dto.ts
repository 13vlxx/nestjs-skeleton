import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsEmailAvailable } from 'src/users/_utils/constraints/is-user-not-existing.constraint';
import { SolidPassword } from '../../decorators/solid-password.decorator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsEmailAvailable()
  email: string;

  @SolidPassword()
  password: string;
}
