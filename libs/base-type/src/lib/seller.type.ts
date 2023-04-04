import { AT } from './a.type';
import { PointT } from './point.type';
import { UserT } from './user.type';
import { CityT } from './city.type';
import { RivalConfigT } from './rival.config.type';
import { PointConfigT } from './point.config.type';
import { ProductCountT } from './product.count.type';

export type SellerT = AT & {
  username: string;
  password: string;
  sysId: string;
  preOrderStatus: boolean;
  demotion: boolean;
  promotion: boolean;
  rivalStatus: boolean;
  email: string;
  phone: string;
  fullName: string;
  logoUrl: string;
  count: ProductCountT;
  user: UserT;
  points: PointT[];
  pointConfigs: PointConfigT[];
  rivals: RivalConfigT[];
  cities: CityT[]; //many-to-many
};
