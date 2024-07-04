import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { SolidPassword } from '../../decorators/solid-password.decorator';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'alexmonac13@gmail.com' })
  email: string;

  @SolidPassword()
  @ApiProperty({ example: 'Test1234**' })
  password: string;
}
