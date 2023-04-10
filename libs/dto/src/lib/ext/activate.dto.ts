import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class ActivateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @Type(() => String)
  hash: string;
}
