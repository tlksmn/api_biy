import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class ProductGetDto {
  @IsNotEmpty()
  sellerId: number;

  @IsOptional()
  take: number;

  @IsOptional()
  page: number;

  @IsOptional()
  available: string;
}
