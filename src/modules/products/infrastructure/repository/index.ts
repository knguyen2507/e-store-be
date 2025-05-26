import { Inject } from '@nestjs/common';
import { ProductModel } from '../../domain/model/product';
import { ProductRepository } from '../../domain/repository';
import { ProductFactory } from '../factory/product';
import { ProductEntity } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { InternalServerErrorException } from '@nestjs/common';

export class ProductRepositoryImplement implements ProductRepository {
  @Inject()
  private readonly factory: ProductFactory;
  @InjectRepository(ProductEntity)
  private readonly repository: Repository<ProductEntity>;
  @Inject()
  private readonly util: UtilityImplement;
  
  async save(data: ProductModel): Promise<ProductModel> {
    try {
      data.id = this.util.generateId();
      const saved = await this.repository.save(data);
      return this.factory.createProductModel(saved);
    } catch (error) {
      console.log('ProductRepositoryImplement:save:error:::', error.message);
      throw new InternalServerErrorException('ProductRepositoryImplement:save:::' + error.message);
    }
    
  }

  async remove(id: string | string[]): Promise<void> {
    const ids = Array.isArray(id) ? id : [id];
    try {
      await this.repository.update({id: In(ids) }, {is_deleted: true});
    } catch (error) {
      console.log('ProductRepositoryImplement:remove:error:::', error.message);
      throw new InternalServerErrorException('ProductRepositoryImplement:remove:::' + error.message);
    }
  }

  async update(data: ProductModel): Promise<ProductModel> {
    const { id, ...updateData } = data;
    try {
      await this.repository.update(id, updateData);
      const updated = await this.repository.findOne({where: {id}});
      return this.factory.createProductModel(updated);
    } catch (error) {
      console.log('ProductRepositoryImplement:update:error:::', error.message);
      throw new InternalServerErrorException('ProductRepositoryImplement:update:::' + error.message);
    }
  }

  async getById(id: string): Promise<ProductModel> {
    try {
      const product = await this.repository.findOne({where: {id}});
      return this.factory.createProductModel(product);
    } catch (error) {
      console.log('ProductRepositoryImplement:getById:error:::', error.message);
      throw new InternalServerErrorException('ProductRepositoryImplement:getById:::' + error.message);
    }
  }

  async getByIds(id: string | string[]): Promise<ProductModel[]> {
    const ids = Array.isArray(id) ? id : [id];
    try {
      const products = await this.repository.findBy({id: In(ids)});
      return this.factory.createProductModels(products);
    } catch (error) {
      console.log('ProductRepositoryImplement:getByIds:error:::', error.message);
      throw new InternalServerErrorException('ProductRepositoryImplement:getByIds:::' + error.message);
    }
  }
}
