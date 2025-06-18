import { Injectable, Logger } from '@nestjs/common';
// import { OrderGrpcService } from './order.grpc.service';
import {
  GetOrderRequest,
  OrderResponse,
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  OrderRequest,
} from '../../interfaces/order.interface';
import { OrderGrpcService } from '../../grpc/ordergrpc/grpc.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderGrpcService: OrderGrpcService) {}

  // async refundOrder(params: RefundOrderRequest): Promise<RefundOrderResponse> {
  //   this.logger.log(`Processing refund for order ${params.orderId}`);

  //   try {
  //     if (!params.orderId || !params.userId || !params.reason) {
  //       this.logger.warn('Missing required fields for refund');
  //       throw new Error('Order ID, user ID and reason are required');
  //     }

  //     const result = await this.orderGrpcService.refundOrder(params);
  //     this.logger.log(`Refund processed successfully: ${result.refundId}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Failed to process refund: ${error}`);
  //     throw new Error(`Failed to process refund: ${error}`);
  //   }
  // }

  // async getAllOrdersByUser(params: UserIdRequest): Promise<OrdersResponse> {
  //   this.logger.log(`Fetching all orders for user ${params.userId}`);

  //   try {
  //     if (!params.userId) {
  //       this.logger.warn('User ID is required to fetch orders');
  //       throw new Error('User ID is required');
  //     }

  //     const result = await this.orderGrpcService.getAllOrdersByUser(params);
  //     this.logger.log(
  //       `Found ${result.orders?.length || 0} orders for user ${params.userId}`,
  //     );
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Failed to fetch orders: ${error}`);
  //     throw new Error(`Failed to fetch orders: ${error}`);
  //   }
  // }

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

  // async cancelOrder(params: CancelOrderRequest): Promise<CancelOrderResponse> {
  //   this.logger.log(
  //     `Cancelling order ${params.orderId} for user ${params.userId}`,
  //   );

  //   try {
  //     if (!params.orderId || !params.userId) {
  //       this.logger.warn('Order ID and user ID are required');
  //       throw new Error('Order ID and user ID are required');
  //     }

  //     const result = await this.orderGrpcService.cancelOrder(params);
  //     this.logger.log(`Order ${params.orderId} cancelled successfully`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Failed to cancel order: ${error}`);
  //     throw new Error(`Failed to cancel order: ${error}`);
  //   }
  // }

  // async exchangeOrder(
  //   params: ExchangeOrderRequest,
  // ): Promise<ExchangeOrderResponse> {
  //   this.logger.log(
  //     `Processing exchange for order ${params.orderId} for user ${params.userId}`,
  //   );

  //   try {
  //     if (!params.orderId || !params.userId) {
  //       this.logger.warn('Order ID and user ID are required');
  //       throw new Error('Order ID and user ID are required');
  //     }

  //     const result = await this.orderGrpcService.exchangeOrder(params);
  //     this.logger.log(
  //       `Exchange processed successfully for order ${params.orderId}`,
  //     );
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Failed to process exchange: ${error}`);
  //     throw new Error(`Failed to process exchange: ${error}`);
  //   }
  // }

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

  // async getOrderDetails(params: OrderRequest): Promise<OrderResponse> {
  //   this.logger.log(`Fetching details for order ${params.orderId}`);

  //   try {
  //     if (!params.orderId) {
  //       this.logger.warn('Order ID is required');
  //       throw new Error('Order ID is required');
  //     }

  //     const result = await this.orderGrpcService.getOrderDetails(params);
  //     this.logger.log(
  //       `Order details fetched successfully for order ${params.orderId}`,
  //     );
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Failed to fetch order details: ${error}`);
  //     throw new Error(`Failed to fetch order details: ${error}`);
  //   }
  // }
}
