import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class ProductGetDto {
  @IsNotEmpty()
  @Min(0)
  sellerId: number;

  @IsOptional()
  take: number;

  @IsOptional()
  page: number;

  @IsOptional()
  available: string;
}
