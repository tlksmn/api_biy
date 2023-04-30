import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { GetUsersDto } from './get.users.dto';

export class DeleteUserDto extends GetUsersDto {
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  id: number;
}
