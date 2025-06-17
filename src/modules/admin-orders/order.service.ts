import { Injectable, Logger } from '@nestjs/common';
// import { OrderGrpcService } from './order.grpc.service';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentSuccessRequest,
  PaymentSuccessResponse,
  RefundOrderRequest,
  RefundOrderResponse,
  UserIdRequest,
  OrdersResponse,
  GetOrderRequest,
  OrderResponse,
  CancelOrderRequest,
  CancelOrderResponse,
  ExchangeOrderRequest,
  ExchangeOrderResponse,
  AddReviewRequest,
  AddReviewResponse,
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


//   async handlePaymentSuccess(params: PaymentSuccessRequest): Promise<PaymentSuccessResponse> {
//     this.logger.log(`Processing payment success for order ${params.orderId}`);
    
//     try {
//       if (!params.orderId || !params.sessionId || !params.status) {
//         this.logger.warn('Missing required fields for payment processing');
//         throw new Error('Order ID, session ID and status are required');
//       }

//       const result = await this.orderGrpcService.handlePaymentSuccess(params);
//       this.logger.log(`Payment processed successfully for order ${params.orderId}`);
//       return result;
//     } catch (error) {
//       this.logger.error(`Failed to process payment: ${error.message}`, error.stack);
//       throw new Error(`Failed to process payment: ${error.message}`);
//     }
//   }

  async refundOrder(params: RefundOrderRequest): Promise<RefundOrderResponse> {
    this.logger.log(`Processing refund for order ${params.orderId}`);
    
    try {
      if (!params.orderId || !params.userId || !params.reason) {
        this.logger.warn('Missing required fields for refund');
        throw new Error('Order ID, user ID and reason are required');
      }

      const result = await this.orderGrpcService.refundOrder(params);
      this.logger.log(`Refund processed successfully: ${result.refundId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process refund: ${error.message}`, error.stack);
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  async getAllOrdersByUser(params: UserIdRequest): Promise<OrdersResponse> {
    this.logger.log(`Fetching all orders for user ${params.userId}`);
    
    try {
      if (!params.userId) {
        this.logger.warn('User ID is required to fetch orders');
        throw new Error('User ID is required');
      }

      const result = await this.orderGrpcService.getAllOrdersByUser(params);
      this.logger.log(`Found ${result.orders?.length || 0} orders for user ${params.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async getOrderById(params: GetOrderRequest): Promise<OrderResponse> {
    this.logger.log(`Fetching order ${params.orderId} for user ${params.userId}`);
    
    try {
      if (!params.orderId || !params.userId) {
        this.logger.warn('Order ID and user ID are required');
        throw new Error('Order ID and user ID are required');
      }

      const result = await this.orderGrpcService.getOrderById(params);
      this.logger.log(`Order ${params.orderId} fetched successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch order: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  async cancelOrder(params: CancelOrderRequest): Promise<CancelOrderResponse> {
    this.logger.log(`Cancelling order ${params.orderId} for user ${params.userId}`);
    
    try {
      if (!params.orderId || !params.userId) {
        this.logger.warn('Order ID and user ID are required');
        throw new Error('Order ID and user ID are required');
      }

      const result = await this.orderGrpcService.cancelOrder(params);
      this.logger.log(`Order ${params.orderId} cancelled successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to cancel order: ${error.message}`, error.stack);
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  async exchangeOrder(params: ExchangeOrderRequest): Promise<ExchangeOrderResponse> {
    this.logger.log(`Processing exchange for order ${params.orderId} for user ${params.userId}`);
    
    try {
      if (!params.orderId || !params.userId) {
        this.logger.warn('Order ID and user ID are required');
        throw new Error('Order ID and user ID are required');
      }

      const result = await this.orderGrpcService.exchangeOrder(params);
      this.logger.log(`Exchange processed successfully for order ${params.orderId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process exchange: ${error.message}`, error.stack);
      throw new Error(`Failed to process exchange: ${error.message}`);
    }
  }

//   async addReview(params: AddReviewRequest): Promise<AddReviewResponse> {
//     this.logger.log(`Adding review to order ${params.orderId} for product ${params.productId}`);
    
//     try {
//       if (!params.orderId || !params.userId || !params.productId || !params.review) {
//         this.logger.warn('Missing required fields for review');
//         throw new Error('Order ID, user ID, product ID and review are required');
//       }

//       const result = await this.orderGrpcService.addReview(params);
//       this.logger.log(`Review added successfully to order ${params.orderId}`);
//       return result;
//     } catch (error) {
//       this.logger.error(`Failed to add review: ${error.message}`, error.stack);
//       throw new Error(`Failed to add review: ${error.message}`);
//     }
//   }

  async getAllOrders(params: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
    this.logger.log(`Fetching all orders with pagination (page: ${params.page}, limit: ${params.limit})`);
    
    try {
      const result = await this.orderGrpcService.getAllOrders(params);
      this.logger.log(`Fetched ${result.orders?.length || 0} orders out of ${result.total}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch orders: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  async updateOrderStatus(params: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    this.logger.log(`Updating status for order ${params.orderId} to ${params.status}`);
    
    try {
      if (!params.orderId || !params.status) {
        this.logger.warn('Order ID and status are required');
        throw new Error('Order ID and status are required');
      }

      const result = await this.orderGrpcService.updateOrderStatus(params);
      this.logger.log(`Status updated successfully for order ${params.orderId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update order status: ${error.message}`, error.stack);
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  async getOrderDetails(params: OrderRequest): Promise<OrderResponse> {
    this.logger.log(`Fetching details for order ${params.orderId}`);
    
    try {
      if (!params.orderId) {
        this.logger.warn('Order ID is required');
        throw new Error('Order ID is required');
      }

      const result = await this.orderGrpcService.getOrderDetails(params);
      this.logger.log(`Order details fetched successfully for order ${params.orderId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch order details: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch order details: ${error.message}`);
    }
  }
}