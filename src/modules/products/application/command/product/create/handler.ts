import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { CreateProduct } from '.';
import { ProductFactory } from 'src/modules/products/infrastructure/factory/product';
import { ProductRepositoryImplement } from 'src/modules/products/infrastructure/repository';  

@CommandHandler(CreateProduct)
export class CreateProductHandler implements ICommandHandler<CreateProduct, void> {
  @Inject()
  private readonly factory: ProductFactory;
  @Inject()
  private readonly product: ProductRepositoryImplement;
  
  constructor(
    private readonly util: UtilityImplement,
  ) {}

  async execute(command: CreateProduct): Promise<void> {
    try {
      const model = this.factory.createProductModel(command.data);
      await this.product.save(model);
    } catch (error) {
      console.log('CreateProductHandler:error:::', error.message);
      throw new InternalServerErrorException(`Không thể tạo product ${command.data.code}`);
    }
  }
}
