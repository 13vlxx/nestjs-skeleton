import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { UsersRepository } from '../users.repository';

@Injectable()
export class GetUserByIdPipe implements PipeTransform {
  constructor(private usersRepository: UsersRepository) {}

  async transform(userId: string) {
    if (!isValidObjectId(userId))
      throw new BadRequestException('INVALID_MONGO_DB_ID');
    return this.usersRepository.findOneById(userId);
  }
}
