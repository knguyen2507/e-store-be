import { Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { ProductQuery } from 'src/modules/products/domain/query';
import { FindProduct } from 'src/modules/products/application/query/product/find';
import { FindProductResult, FindProductResultItem } from 'src/modules/products/application/query/product/find/result';
import { FindProductByCode } from 'src/modules/products/application/query/product/detail';
import { FindProductByCodeResult } from 'src/modules/products/application/query/product/detail/result';
import { FindProductById } from 'src/modules/products/application/query/product/find-by-id';
import { FindProductByIdResult } from 'src/modules/products/application/query/product/find-by-id/result';
import { ProductEntity } from 'src/modules/products/infrastructure/entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ProductQueryImplement implements ProductQuery {
  @Inject()
  private readonly util: UtilityImplement;
  @InjectRepository(ProductEntity)
  private readonly repository: Repository<ProductEntity>;

  async find(query: FindProduct): Promise<FindProductResult> {
    try {
      const { 
        offset = 0, 
        limit = 10, 
        searchName, 
        sortBy = 'created_at', 
        sortOrder = 'DESC' 
      } = query.data;
      
      const queryBuilder = this.repository
        .createQueryBuilder('product')
        .where('product.is_deleted = :isDeleted', { isDeleted: false })
        .orderBy(`product.${sortBy}`, sortOrder as 'ASC' | 'DESC')
        .skip(Number(offset))
        .take(Number(limit));

      if (searchName) {
        queryBuilder.andWhere('product.name ILIKE :searchName', { searchName: `%${searchName}%` });
      }
        
      const [products, total] = await queryBuilder.getManyAndCount();

      const items = products.map((product) => {
        const { is_deleted, ...data } = product;
        return plainToClass(
          FindProductResultItem,
          data,
          { excludeExtraneousValues: true },
        );
      });

      return {
        items,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.log('ProductQueryImplement:find:::error:::', error.message);
      throw new InternalServerErrorException('ProductQueryImplement:find:::' + error.message);
    }
  }

  async findByCode(query: FindProductByCode): Promise<FindProductByCodeResult> {
    let product: ProductEntity;
    try {
      const { code } = query.data;
      product = await this.repository.findOne({ 
        where: { 
          code,
          is_deleted: false 
        } 
      });

      
    } catch (error) {
      console.log('ProductQueryImplement:findByCode:error:::', error.message);
      throw new InternalServerErrorException('ProductQueryImplement:findByCode:::' + error.message);
    }

    if (!product) {
      console.log('ProductQueryImplement:findByCode::: product not found');
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã ${query.data.code}`);
    }
    

    return plainToClass(FindProductByCodeResult, product, {
      excludeExtraneousValues: true,
    });
  }

  async findById(query: FindProductById): Promise<FindProductByIdResult> {
    let product: ProductEntity;
    try {
      const { id } = query.data;
      product = await this.repository.findOne({ 
        where: { 
          id,
          is_deleted: false 
        } 
      });
    } catch (error) {
      console.log('ProductQueryImplement:findById:error:::', error.message);
      throw new InternalServerErrorException('ProductQueryImplement:findById:::' + error.message);
    }

    if (!product) {
      console.log('ProductQueryImplement:findById::: product not found');
      throw new NotFoundException(`Không tìm thấy sản phẩm với id ${query.data.id}`);
    }

    return plainToClass(FindProductByIdResult, product, {
      excludeExtraneousValues: true,
    });
  }
}
