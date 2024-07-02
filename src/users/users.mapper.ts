import { Injectable } from '@nestjs/common';
import { GetUserDto } from './_utils/dtos/responses/get-user.dto';
import { UserDocument } from './user.schema';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: UserDocument): GetUserDto => ({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
  });
}
