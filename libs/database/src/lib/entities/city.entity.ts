import { Column, Entity, Index, OneToMany, Unique } from 'typeorm';
import { PointEntity } from './point.entity';
import { PointConfigEntity } from './point.config.entity';
import { AEntity } from './a.entity';
import { RivalConfigEntity } from './rival.config.entity';

@Unique('cityCode_Name_uniques', ['name', 'code'])
@Entity('city')
export class CityEntity extends AEntity {
  @Index()
  @Column()
  name: string;

  @Index()
  @Column()
  code: number;

  //---- relations ----

  @OneToMany(() => PointConfigEntity, (config) => config.city)
  pointConfigs: PointConfigEntity[];

  @OneToMany(() => PointEntity, (point) => point.city)
  points: PointEntity[];

  @OneToMany(() => RivalConfigEntity, (rival) => rival.city)
  rivalConfigs: RivalConfigEntity[];
}
