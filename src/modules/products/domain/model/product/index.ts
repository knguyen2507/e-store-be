import { Expose } from 'class-transformer';

export class ProductModel {
  @Expose()
  id: string;
  @Expose()
  code: string;
  @Expose()
  name: string;
  @Expose()
  is_deleted: boolean;
  @Expose()
  created_at: Date;
  @Expose()
  updated_at: Date;

  update(data: Partial<this>) {
    this.name = data.name ? data.name : this.name;
  }
}
