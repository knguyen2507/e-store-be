import { BaseQuery } from 'src/modules/products/application/query/base';

export class FindProductByCode extends BaseQuery {
  data: {
    readonly code: string;
  };

  constructor(data: FindProductByCode) {
    super(data);
  }
}
