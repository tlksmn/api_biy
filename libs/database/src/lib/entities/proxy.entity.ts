import { Column, Entity } from 'typeorm';
import { AEntity } from './a.entity';

@Entity('proxy')
export class ProxyEntity extends AEntity {
  @Column()
  host: string;

  @Column()
  port: number;

  @Column()
  protocol: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;
}
