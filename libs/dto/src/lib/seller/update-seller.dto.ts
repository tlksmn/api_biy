import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSellerDto {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsBoolean()
  preOrderStatus: boolean;

  @IsOptional()
  @IsBoolean()
  demotion: boolean;

  @IsOptional()
  @IsBoolean()
  promotion: boolean;

  @IsOptional()
  @IsBoolean()
  rivalStatus: boolean;
}
