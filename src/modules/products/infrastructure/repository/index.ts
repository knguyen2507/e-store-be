import { Inject } from '@nestjs/common';
import { ProductModel } from '../../domain/model/product';
import { ProductRepository } from '../../domain/repository';
import { ProductFactory } from '../factory/product';
import { ProductEntity } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

export class ProductRepositoryImplement implements ProductRepository {
  @Inject()
  private readonly factory: ProductFactory;
  @InjectRepository(ProductEntity)
  private readonly repository: Repository<ProductEntity>;

  async save(data: ProductModel): Promise<ProductModel> {
    const saved = await this.repository.save(data);
    return this.factory.createProductModel(saved);
  }

  async remove(id: string | string[]): Promise<void> {
    const ids = Array.isArray(id) ? id : [id];
    await this.repository.update({id: In(ids) }, {is_deleted: true});
  }

  async update(data: ProductModel): Promise<ProductModel> {
    const { id, ...updateData } = data;
    await this.repository.update(id, updateData);
    const updated = await this.repository.findOne({where: {id}});
    return this.factory.createProductModel(updated);
  }

  async getById(id: string): Promise<ProductModel> {
    const product = await this.repository.findOne({where: {id}});
    return this.factory.createProductModel(product);
  }

  async getByIds(id: string | string[]): Promise<ProductModel[]> {
    const ids = Array.isArray(id) ? id : [id];
    const products = await this.repository.findBy({id: In(ids)});
    return this.factory.createProductModels(products);
  }
}
