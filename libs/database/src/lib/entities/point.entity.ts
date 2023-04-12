import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { CityEntity } from './city.entity';
import { PointConfigEntity } from './point.config.entity';
import { AEntity } from './a.entity';
import { StateE } from '@biy/api-type';

@Entity('point')
export class PointEntity extends AEntity {
  @Column()
  name: string;

  @Column()
  streetName: string;

  @Column({
    type: 'enum',
    enum: StateE,
    default: StateE.ACTIVE,
  })
  status: StateE;

  //---- relations ----

  @OneToMany(() => PointConfigEntity, (config) => config.point)
  pointConfigs: PointConfigEntity[];

  @ManyToOne(() => CityEntity, (city) => city.points)
  city: CityEntity;

  @ManyToOne(() => SellerEntity, (seller) => seller.points, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  seller: SellerEntity;
}
