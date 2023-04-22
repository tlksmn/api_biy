import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { AEntity } from './a.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity extends AEntity {
  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  activated: boolean;

  @Column({ nullable: true })
  name: string;

  @Index()
  @Column({ unique: true })
  hash: string;

  //---- relations ----

  @OneToMany(() => SellerEntity, (seller) => seller.user)
  sellers: SellerEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static checkPassword(current: string, hash: string): Promise<boolean> {
    return bcrypt.compare(current, hash);
  }
}
