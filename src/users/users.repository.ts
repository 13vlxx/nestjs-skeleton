import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/_utils/dtos/requests/register-user.dto';
import { User } from './user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  private readonly USER_NOT_FOUND_EXCEPTION = new NotFoundException(
    'USER_NOT_FOUND',
  );

  findOneById = (id: string) =>
    this.model
      .findOne({ _id: id, deletedAt: null })
      .orFail(this.USER_NOT_FOUND_EXCEPTION)
      .exec();

  findOneByEmail = (email: string) =>
    this.model.findOne({ email: email, deletedAt: null }).exec();

  register = (registerUserDto: RegisterUserDto) =>
    this.model.create({
      firstname: registerUserDto.firstname,
      lastname: registerUserDto.lastname,
      email: registerUserDto.email,
      password: hashSync(registerUserDto.password, 10),
    });

  safeDeleteUser = (by: User, user: User) =>
    this.model.findOneAndUpdate(user, { deletedBy: by, deletedAt: new Date() });
}
