import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  code: string;
} 