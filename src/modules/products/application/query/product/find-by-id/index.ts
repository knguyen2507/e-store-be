import { BaseQuery } from 'src/modules/products/application/query/base';

export class FindProductById extends BaseQuery {
  data: {
    readonly id: string;
  };

  constructor(data: FindProductById) {
    super(data);
  }
}
