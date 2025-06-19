import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('admin/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @Get('/:userId/:orderId')
  async getOrderbyID(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.getOrderById({ userId, orderId });
  }

  @Get()
  async getAllOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.getAllOrders({ page, limit });
  }

  @Post('status')
  async updateOrderStatus(@Body() updateOrderStatusDto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(updateOrderStatusDto);
  }
}
