import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserDocument } from 'src/users/user.schema';
import { UsersMapper } from 'src/users/users.mapper';
import { UsersRepository } from 'src/users/users.repository';
import { LoginUserDto } from './_utils/dtos/requests/login-user.dto';
import { RegisterUserDto } from './_utils/dtos/requests/register-user.dto';
import { JwtPayload } from './_utils/jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user: UserDocument = await this.usersRepository.findOneByEmail(
      loginUserDto.email,
    );
    if (!user || !compareSync(loginUserDto.password, user.password))
      throw new NotFoundException('USER_NOT_FOUND');

    return {
      user: this.usersMapper.toGetUserDto(user),
      token: this.createToken(user),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.usersRepository.register(registerUserDto);

    return {
      user: this.usersMapper.toGetUserDto(user),
      token: this.createToken(user),
    };
  }

  private createToken(user: UserDocument) {
    const payload: JwtPayload = {
      id: user.id,
    };

    return this.jwtService.sign(payload);
  }
}
