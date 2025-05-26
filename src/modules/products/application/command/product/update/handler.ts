import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { UpdateProduct } from '.';
import { ProductRepositoryImplement } from 'src/modules/products/infrastructure/repository';

@CommandHandler(UpdateProduct)
export class UpdateProductHandler implements ICommandHandler<UpdateProduct, void> {
  @Inject()
  private readonly product: ProductRepositoryImplement;
  
  constructor(
    private readonly util: UtilityImplement,
  ) {}

  async execute(command: UpdateProduct): Promise<void> {
    const { id, ...data } = command.data;
    const model = await this.product.getById(id);
    model.update({ ...data });

    await this.product.update(model);
  }
}
