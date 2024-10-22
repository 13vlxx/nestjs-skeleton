import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { getDocumentPipe } from 'src/_utils/pipes/global-pipe-by-property.pipe';
import { ConnectedUser } from 'src/auth/_utils/decorators/connected-user.decorator';
import { Protect } from 'src/auth/_utils/decorators/protect.decorator';
import { UserRoleEnum } from './_utils/user-role.enum';
import { User, UserDocument } from './user.schema';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
  ) {}

  @Protect()
  @Get('me')
  @ApiOperation({ summary: 'Get connected user' })
  getMe(@ConnectedUser() user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }

  @Protect(UserRoleEnum.ADMIN)
  @Delete(':userEmail')
  @HttpCode(204)
  @ApiParam({ name: 'userEmail', type: String })
  @ApiOperation({ summary: 'Safe delete an user' })
  safeDeleteUser(
    @ConnectedUser() by: UserDocument,
    @Param(
      'userEmail',
      getDocumentPipe(User, {
        property: 'email',
        excludeDeleted: true,
      }),
    )
    user: UserDocument,
  ) {
    return this.usersRepository.safeDeleteUser(by, user);
  }
}
