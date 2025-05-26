import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsNumber()
  is_deleted: number;
} 