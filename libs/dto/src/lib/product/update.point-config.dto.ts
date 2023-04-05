import { IsBoolean, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdatePointConfigDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @Min(0)
  @IsOptional()
  preOrder: number;

  @IsBoolean()
  @IsOptional()
  available: boolean;
}
