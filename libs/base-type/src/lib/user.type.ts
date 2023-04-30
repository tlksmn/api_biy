import { AT } from './a.type';
import { SellerT } from './seller.type';

export type UserT = AT & {
  email: string;
  password: string;
  phone: string;
  activated: boolean;
  accessed: boolean;
  name: string;
  hash: string;
  sellers: SellerT[];
};
