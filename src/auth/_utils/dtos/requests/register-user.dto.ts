import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/user.schema';
import { SolidPassword } from '../../decorators/solid-password.decorator';
import { IsUnique } from '../../decorators/unique-exists.decorator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Alex' })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Goat' })
  lastname: string;

  @IsEmail()
  @IsUnique(User, { includeDeleted: true })
  @ApiProperty({ example: 'alexmonac13@gmail.com' })
  email: string;

  @SolidPassword()
  @ApiProperty({ example: 'Test1234**' })
  password: string;
}
