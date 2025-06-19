import { Injectable, Logger } from '@nestjs/common';
import {
  GetOrderRequest,
  OrderResponse,
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '../../interfaces/order.interface';
import { OrderGrpcService } from '../../grpc/ordergrpc/grpc.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderGrpcService: OrderGrpcService) {}

  async getOrderById(params: GetOrderRequest): Promise<OrderResponse> {
    this.logger.log(
      `Fetching order ${params.orderId} for user ${params.userId}`,
    );

    try {
      if (!params.orderId || !params.userId) {
        this.logger.warn('Order ID and user ID are required');
        throw new Error('Order ID and user ID are required');
      }

      const result = await this.orderGrpcService.getOrderById(params);
      this.logger.log(`Order ${params.orderId} fetched successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch order: ${error}`);
      throw new Error(`Failed to fetch order: ${error}`);
    }
  }

  async getAllOrders(
    params: GetAllOrdersRequest,
  ): Promise<GetAllOrdersResponse> {
    this.logger.log(
      `Fetching all orders with pagination (page: ${params.page}, limit: ${params.limit})`,
    );

    try {
      const result = await this.orderGrpcService.getAllOrders(params);
      this.logger.log(
        `Fetched ${result.orders?.length || 0} orders out of ${result.total}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${error}`);
      throw new Error(`Failed to fetch orders: ${error}`);
    }
  }

  async updateOrderStatus(
    params: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> {
    this.logger.log(
      `Updating status for order ${params.orderId} to ${params.status}`,
    );

    try {
      if (!params.orderId || !params.status) {
        this.logger.warn('Order ID and status are required');
        throw new Error('Order ID and status are required');
      }

      const result = await this.orderGrpcService.updateOrderStatus(params);
      this.logger.log(
        `Status updated successfully for order ${params.orderId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to update order status: ${error}`);
      throw new Error(`Failed to update order status: ${error}`);
    }
  }
}