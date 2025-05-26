import { BaseCommand } from 'src/modules/products/application/command/base';

export class CreateProduct extends BaseCommand {
  data: {
    readonly id: string | null;
    readonly code: string;
    readonly name: string;
  };

  constructor(data: CreateProduct) {
    super(data);
  }
}
