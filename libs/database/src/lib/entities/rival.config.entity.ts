import { Column, Entity, Index, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AEntity } from './a.entity';
import { SellerEntity } from './seller.entity';
import { ProductEntity } from './product.entity';
import { CityEntity } from './city.entity';
import { PointConfigEntity } from './point.config.entity';
import { PriceListApiT } from '@biy/api-type';

@Entity('rival_config')
@Unique('product_city_seller', ['product', 'city', 'seller'])
export class RivalConfigEntity extends AEntity {
  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  minPrice: number;

  @Column({ type: 'json', nullable: true })
  rivalSeller: PriceListApiT;

  //---- relations ----

  @OneToMany(() => PointConfigEntity, (pointConfig) => pointConfig.rivalConfig)
  pointConfigs: PointConfigEntity[];

  @Index()
  @ManyToOne(() => SellerEntity, (seller) => seller.rivalConfigs, {
    onDelete: 'CASCADE',
  })
  seller: SellerEntity;

  @Index()
  @ManyToOne(() => ProductEntity, (product) => product.rivalConfigs)
  product: ProductEntity;

  @ManyToOne(() => CityEntity, (city) => city.rivalConfigs)
  city: CityEntity;
}
