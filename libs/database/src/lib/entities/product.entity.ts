import { Column, Entity, Unique, OneToMany } from 'typeorm';

import { PointConfigEntity } from './point.config.entity';
import { AEntity } from './a.entity';
import { RivalConfigEntity } from './rival.config.entity';

@Entity('product')
@Unique('name', ['name', 'sku', 'brand'])
export class ProductEntity extends AEntity {
  @Column({ nullable: false })
  name: string;

  @Column()
  url: string;

  @Column({ nullable: false })
  sku: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  image: string;

  //---- relations ----

  @OneToMany(() => PointConfigEntity, (config) => config.product)
  pointConfigs: PointConfigEntity[];

  @OneToMany(() => RivalConfigEntity, (rival) => rival.product)
  rivalConfigs: RivalConfigEntity[];
}
