import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { CityEntity } from './city.entity';
import { PointEntity } from './point.entity';
import { PointConfigEntity } from './point.config.entity';
import { UserEntity } from './user.entity';
import { AEntity } from './a.entity';
import { ProductCountEntity } from './product.count.entity';
import { RivalConfigEntity } from './rival.config.entity';

@Entity('seller')
@Unique('uniques_username_sysId_email', ['username', 'sysId', 'email'])
export class SellerEntity extends AEntity {
  @Column({ unique: true })
  username: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column()
  sysId: string;

  //предзаказ
  @Column({ default: false })
  preOrderStatus: boolean;

  //на понижение
  @Column({ default: false })
  demotion: boolean;

  //на повышение
  @Column({ default: false })
  promotion: boolean;

  // конкурентность {36-40}
  @Column({ default: false })
  rivalStatus: boolean;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  logoUrl: string;

  //---- relations ----

  @OneToOne(() => ProductCountEntity, (count) => count.seller)
  count: ProductCountEntity;

  @ManyToOne(() => UserEntity, (user) => user.sellers)
  user: UserEntity;

  @OneToMany(() => PointEntity, (point) => point.seller)
  points: PointEntity[];

  @OneToMany(() => PointConfigEntity, (config) => config.seller, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pointConfigs: PointConfigEntity[];

  @OneToMany(() => RivalConfigEntity, (rival) => rival.seller, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rivalConfigs: RivalConfigEntity[];

  @ManyToMany(() => CityEntity)
  @JoinTable({
    name: 'seller_cities',
    joinColumn: { name: 'seller_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'city_id', referencedColumnName: 'id' },
  })
  cities: CityEntity[];
}
