import { AT } from './a.type';
import { CityT } from './city.type';
import { SellerT } from './seller.type';
import { PointConfigT } from './point.config.type';
import { StateE } from '@biy/database';

export type PointT = AT & {
  name: string;
  streetName: string;
  //---- relations ----
  status: StateE;
  pointConfigs: PointConfigT[];
  city: CityT;
  seller: SellerT;
};
