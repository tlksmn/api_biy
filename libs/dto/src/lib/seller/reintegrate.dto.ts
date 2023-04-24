import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ReintegrateDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sellerId: number;
}
