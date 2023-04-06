import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ActivateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  hash: string;
}
