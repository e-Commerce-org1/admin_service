import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class VariantResponseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier of the variant',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    required: false,
    description: 'Size of the product variant',
    example: 'XL',
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    required: false,
    description: 'Color of the product variant',
    example: 'Red',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'Current stock quantity',
    minimum: 0,
    example: 100,
  })
  @IsInt()
  stock: number;
}