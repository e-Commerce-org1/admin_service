import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order.dto';
import { RefundOrderDto } from './dto/refund.dto';

@Controller('admin/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('refund')
  async refundOrder(@Body() refundOrderDto: RefundOrderDto) {
    return this.orderService.refundOrder(refundOrderDto);
  }

  // @Get('user/:Id')
  // async getUserOrders(@Param('Id') userId: string) {
  //   return this.orderService.getAllOrdersByUser(userId);
  // }

  @Get('/:userId/:orderId')
  async getOrderbyID(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.orderService.getOrderById({ userId, orderId });
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderDetails({ orderId });
  }

  @Post('cancel')
  async cancelOrder(
    @Body() cancelOrderDto: { orderId: string; userId: string },
  ) {
    return this.orderService.cancelOrder(cancelOrderDto);
  }

  @Post('exchange')
  async exchangeOrder(
    @Body() exchangeOrderDto: { orderId: string; userId: string },
  ) {
    return this.orderService.exchangeOrder(exchangeOrderDto);
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
