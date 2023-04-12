import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { AEntity } from './a.entity';

@Entity('count')
export class ProductCountEntity extends AEntity {
  @Column()
  activeCount: number;

  @Column()
  expiringCount: number;

  @Column()
  archiveCount: number;

  @Column()
  processingCount: number;

  //---- relations ----

  @Index()
  @OneToOne(() => SellerEntity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  seller: SellerEntity;
}
