import { UserRoleEnum } from '../../user-role.enum';

export class GetUserDto {
  firstname: string;
  lastname: string;
  email: string;
  role: UserRoleEnum;
}
