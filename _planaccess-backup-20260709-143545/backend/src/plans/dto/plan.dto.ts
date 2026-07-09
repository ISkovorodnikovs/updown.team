import {
  IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray,
  Min, Max, MaxLength, ArrayMaxSize,
} from 'class-validator';
import { PlanType } from '../../database/entities/plan.entity';

export class CreatePlanDto {
  @IsEnum(PlanType)
  type: PlanType;

  @IsString()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000000)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(8)
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(40)
  features?: string[];

  @IsOptional() @IsBoolean() hasSignalsCrypto?: boolean;
  @IsOptional() @IsBoolean() hasSignalsForex?: boolean;
  @IsOptional() @IsBoolean() hasAiAnalytics?: boolean;
  @IsOptional() @IsBoolean() hasTablePredictor?: boolean;
  @IsOptional() @IsBoolean() hasStrongLevels?: boolean;
  @IsOptional() @IsBoolean() hasLiquidityZones?: boolean;
  @IsOptional() @IsBoolean() hasPumpMM?: boolean;
  @IsOptional() @IsBoolean() hasFibonacci?: boolean;
  @IsOptional() @IsBoolean() hasCopytrading?: boolean;
  @IsOptional() @IsBoolean() hasEducation?: boolean;
  @IsOptional() @IsBoolean() hasCommunity?: boolean;
  @IsOptional() @IsBoolean() hasSupport?: boolean;

  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @IsOptional() @IsBoolean() translateAll?: boolean;
}

// Все поля опциональны при обновлении
export class UpdatePlanDto {
  @IsOptional() @IsEnum(PlanType) type?: PlanType;
  @IsOptional() @IsString() @MaxLength(64) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) @Max(1000000) price?: number;
  @IsOptional() @IsString() @MaxLength(8) currency?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(40) features?: string[];

  @IsOptional() @IsBoolean() hasSignalsCrypto?: boolean;
  @IsOptional() @IsBoolean() hasSignalsForex?: boolean;
  @IsOptional() @IsBoolean() hasAiAnalytics?: boolean;
  @IsOptional() @IsBoolean() hasTablePredictor?: boolean;
  @IsOptional() @IsBoolean() hasStrongLevels?: boolean;
  @IsOptional() @IsBoolean() hasLiquidityZones?: boolean;
  @IsOptional() @IsBoolean() hasPumpMM?: boolean;
  @IsOptional() @IsBoolean() hasFibonacci?: boolean;
  @IsOptional() @IsBoolean() hasCopytrading?: boolean;
  @IsOptional() @IsBoolean() hasEducation?: boolean;
  @IsOptional() @IsBoolean() hasCommunity?: boolean;
  @IsOptional() @IsBoolean() hasSupport?: boolean;

  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() @Min(0) sortOrder?: number;
  @IsOptional() @IsBoolean() translateAll?: boolean;
}
