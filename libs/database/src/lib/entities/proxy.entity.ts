import { Column, Entity } from 'typeorm';
import { AEntity } from './a.entity';

@Entity('proxy')
export class ProxyEntity extends AEntity {
  @Column()
  ip: string;

  @Column()
  port: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  country: string;

  @Column({ type: 'boolean' })
  active: boolean;
}
