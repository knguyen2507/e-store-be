import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthnGuard } from 'src/libs/guard/authentication/authn.guard';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import { CreateProduct } from '../application/command/product/create';
import { UpdateProduct } from '../application/command/product/update';
import { CreateProductDto } from './dto/command/create-product.dto';
import { UpdateProductDto } from './dto/command/update-product.dto';


@ApiTags('product/command')
@Controller('product/command')
@UseGuards(AuthnGuard)
@ApiBearerAuth()
export class ProductCommandController {
  constructor(
    private readonly util: UtilityImplement,
    readonly commandBus: CommandBus,
  ) {}

  @Post('create')
  async CreateProduct(
    @Body() body: CreateProductDto,
  ): Promise<any> {
    const msg = {
      messageId: this.util.generateId(),
      data: {
        id: null,
        code: body.code,
        name: body.name,
      },
    };
    const command = new CreateProduct(msg);
    return await this.commandBus.execute(command);
  }

  @Post('update')
  async UpdateProduct(
    @Body() body: UpdateProductDto,
  ): Promise<any> {

    const msg = {
      messageId: this.util.generateId(),
      data: {
        id: body.id,
        name: body.name,
      },
    };
    const command = new UpdateProduct(msg);
    return await this.commandBus.execute(command);
  }
}
