


import { ApiProperty } from '@nestjs/swagger';
import { VariantResponseDto } from './variant-response.dto';

export class ProductResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  brand: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  totalStock: number;

  @ApiProperty({ type: [VariantResponseDto] })
  variants: VariantResponseDto[];
}