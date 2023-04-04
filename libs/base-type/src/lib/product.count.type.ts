import { AT } from './a.type';
import { SellerT } from './seller.type';

export type ProductCountT = AT & {
  activeCount: number;
  expiringCount: number;
  archiveCount: number;
  processingCount: number;
  //---- relations ----
  seller: SellerT;
};
