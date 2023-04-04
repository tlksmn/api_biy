import { AT } from './a.type';
import { PointConfigT } from './point.config.type';
import { PointT } from './point.type';
import { RivalConfigT } from './rival.config.type';

export type CityT = AT & {
  name: string;
  code: number;
  //---- relations ----
  pointConfigs: PointConfigT[];
  points: PointT[];
  rivals: RivalConfigT[];
};
