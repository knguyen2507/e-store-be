import { BaseQuery } from 'src/modules/products/application/query/base';
import { SortOrder } from 'src/libs/utility/enum';

export class FindProduct extends BaseQuery {
  data: {
    offset: number;
    limit: number;
    searchName?: string;
    searchType?: string;
    searchValue?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
  };

  constructor(data: FindProduct) {
    super(data);
  }
}
