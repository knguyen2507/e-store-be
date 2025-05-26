import { BaseCommand } from 'src/modules/products/application/command/base';

export class CreateProduct extends BaseCommand {
  data: {
    readonly code: string;
    readonly name: string;
    readonly is_deleted: boolean;
  };

  constructor(data: CreateProduct) {
    super(data);
  }
}
