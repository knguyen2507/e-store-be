import { ProductModel } from '../../../domain/model/product';
import { BaseFactory } from '../base';

interface IProduct {
  id?: string;
  code?: string;
  name?: string;
  is_deleted?: boolean;
}

export class ProductFactory extends BaseFactory {
  createProductModel(product: IProduct | null) {
    if (!product) return null;

    const entity = this.createModel(ProductModel, {
      ...product,
    });

    return entity;
  }

  createProductModels(products: IProduct[] | null) {
    if (!products) return null;

    return products.map((a) => this.createProductModel(a));
  }
}
