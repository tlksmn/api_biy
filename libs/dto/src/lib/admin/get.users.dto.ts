import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GetUsersDto {
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  pass: string;
}
