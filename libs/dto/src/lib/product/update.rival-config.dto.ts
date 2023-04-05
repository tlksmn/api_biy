import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class UpdateRivalConfigDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @Min(0)
  @IsOptional()
  minPrice: number;

  @Min(0)
  @IsOptional()
  price: number;
}
