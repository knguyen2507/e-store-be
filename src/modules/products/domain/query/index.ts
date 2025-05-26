import { FindProductByCode } from 'src/modules/products/application/query/product/detail';
import { FindProductByCodeResult } from 'src/modules/products/application/query/product/detail/result';
import { FindProduct } from 'src/modules/products/application/query/product/find';
import { FindProductById } from 'src/modules/products/application/query/product/find-by-id';
import { FindProductByIdResult } from 'src/modules/products/application/query/product/find-by-id/result';
import { FindProductResult } from 'src/modules/products/application/query/product/find/result';

export interface ProductQuery {
  find: (query: FindProduct) => Promise<FindProductResult>;
  findByCode: (query: FindProductByCode) => Promise<FindProductByCodeResult>;
  findById: (query: FindProductById) => Promise<FindProductByIdResult>;
}
