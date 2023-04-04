import { AT } from './a.type';
import { SellerT } from './seller.type';
import { ProductT } from './product.type';
import { CityT } from './city.type';
import { PointT } from './point.type';
import { RivalConfigT } from './rival.config.type';
import { StateE } from '@biy/database';

export type PointConfigT = AT & {
  available: boolean;
  status: StateE;
  preOrder: number;
  //---- relations ----
  seller: SellerT;
  product: ProductT;
  city: CityT;
  point: PointT;
  rival: RivalConfigT;
};
