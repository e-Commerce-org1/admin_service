import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class VariantStockUpdateDto {
  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}

export class InventoryUpdateAdminDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantStockUpdateDto)
  variants: VariantStockUpdateDto[];
}
