import { AT } from './a.type';
import { SellerT } from './seller.type';
import { CityT } from './city.type';
import { ProductT } from './product.type';
import { PointConfigT } from './point.config.type';

export type RivalConfigT = AT & {
  price: number;
  minPrice: number;
  rivalSeller: any;
  pointConfigs: PointConfigT[];
  seller: SellerT;
  product: ProductT;
  city: CityT;
};