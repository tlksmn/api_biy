import { IsBoolean, IsNotEmpty, Min } from 'class-validator';
import { GetUsersDto } from './get.users.dto';

export class UpdateUserDto extends GetUsersDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  @IsBoolean()
  activated: boolean;

  @IsNotEmpty()
  @IsBoolean()
  accessed: boolean;
}
