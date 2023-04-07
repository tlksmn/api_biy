import { IsNotEmpty } from 'class-validator';
import { PriceListApiT } from '@biy/api-type';

export class UpdateRivalDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  sellerId: number;

  @IsNotEmpty()
  data: PriceListApiT;
}
