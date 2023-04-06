import { IsNotEmpty } from 'class-validator';

export class UpdateRivalDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  sellerId: number;

  @IsNotEmpty()
  data: number;
}
