import { BaseCommand } from 'src/modules/products/application/command/base';

export class UpdateProduct extends BaseCommand {
  data: {
    readonly id: string;
    readonly name: string;
  };

  constructor(data: UpdateProduct) {
    super(data);
  }
}
