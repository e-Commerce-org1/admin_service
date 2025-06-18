import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

// Define possible order status values (adjust according to your business logic)
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'The new status of the order',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
