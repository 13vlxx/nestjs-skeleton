import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsExisting } from 'src/_utils/constraints/unique-exists.constraint';
import { User } from 'src/users/user.schema';
import { SolidPassword } from '../../decorators/solid-password.decorator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsExisting(User.name, 'email')
  email: string;

  @SolidPassword()
  password: string;
}
