import { ProductEntity, SellerEntity } from '@biy/database';

export interface FileI {
  generate(seller: SellerEntity, products: ProductEntity[]);
}
