import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}