import { BaseQuery } from 'src/modules/products/application/query/base';

export class FindProduct extends BaseQuery {
  data: {
    offset: number;
    limit: number;
    searchName?: string;
    searchType?: string;
    searchValue?: string;
  };

  constructor(data: FindProduct) {
    super(data);
  }
}
