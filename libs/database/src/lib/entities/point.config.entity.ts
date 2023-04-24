import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { ProductEntity } from './product.entity';
import { CityEntity } from './city.entity';
import { PointEntity } from './point.entity';
import { SellerEntity } from './seller.entity';
import { AEntity } from './a.entity';
import { StateE } from '@biy/api-type';
import { RivalConfigEntity } from './rival.config.entity';

@Unique('seller_product_city_point', ['seller', 'product', 'city', 'point'])
@Entity('point_config')
export class PointConfigEntity extends AEntity {
  @Column({ default: false })
  available: boolean;
  // it's managed for preorders in xml *
  // if not available and status active *p
  // xml auto show preorder days *
  // but we can change preorder and available value *
  // if its false and archive it doesn't send in xml
  // preorder should be greater than 0 and less 15
  // else not shown in preorder value xml

  @Column({
    type: 'enum',
    enum: StateE,
    default: StateE.ACTIVE,
  })
  status: StateE;

  @Column({ default: 0 })
  preOrder: number;

  //---- relations ----

  @Index()
  @ManyToOne(() => SellerEntity, (seller) => seller.pointConfigs, {
    onDelete: 'CASCADE',
  })
  seller: SellerEntity;

  @Index()
  @ManyToOne(() => ProductEntity, (product) => product.pointConfigs)
  product: ProductEntity;

  @ManyToOne(() => CityEntity, (city) => city.pointConfigs)
  city: CityEntity;

  @ManyToOne(() => PointEntity, (point) => point.pointConfigs)
  point: PointEntity;

  @Index()
  @ManyToOne(() => RivalConfigEntity, (rival) => rival.pointConfigs)
  rivalConfig: RivalConfigEntity;
}
