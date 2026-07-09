import {
  IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, IsUrl,
  Min, Max, MaxLength, ArrayMaxSize,
} from 'class-validator';
import { ProductType } from '../../database/entities/shop-product.entity';

export class CreateShopProductDto {
  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  @MaxLength(120)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tradingViewUrl?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000000)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(40)
  features?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(40)
  badge?: string;

  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional() @IsNumber() @Min(0) sortOrder?: number;

  @IsOptional() meta?: Record<string, any>;

  // Флаг (не хранится): перевести name/description на все языки через Claude API
  @IsOptional() @IsBoolean() translateAll?: boolean;
}

export class UpdateShopProductDto {
  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() @MaxLength(500) tradingViewUrl?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(1000000) price?: number;
  @IsOptional() @IsString() @MaxLength(8) currency?: string;
  @IsOptional() @IsString() @MaxLength(500) imageUrl?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(40) features?: string[];
  @IsOptional() @IsString() @MaxLength(40) badge?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() @Min(0) sortOrder?: number;
  @IsOptional() meta?: Record<string, any>;
  @IsOptional() @IsBoolean() translateAll?: boolean;
}
