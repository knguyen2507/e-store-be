import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from 'src/libs/database/base.entity';

@Entity('products')
@Unique(['code'])
export class ProductEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  is_deleted: boolean;
} 