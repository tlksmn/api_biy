import { AT } from './a.type';
import { PointConfigT } from './point.config.type';
import { RivalConfigT } from './rival.config.type';

export type ProductT = AT & {
  name: string;
  url: string;
  sku: string;
  brand: string;
  image: string;
  //---- relations ----
  pointConfigs: PointConfigT[];
  rivalConfigs: RivalConfigT[];
};
