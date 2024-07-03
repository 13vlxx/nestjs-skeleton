import { IsExisting } from 'src/_utils/constraints/unique-exists.constraint';
import { User } from 'src/users/user.schema';

export class TestDto {
  @IsExisting(User.name, '_id')
  id: string;
}
