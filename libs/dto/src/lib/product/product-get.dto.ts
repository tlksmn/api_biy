import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductGetDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  sellerId: number;

  @IsOptional()
  take: number;

  @IsOptional()
  page: number;

  @IsOptional()
  available: string;
}
