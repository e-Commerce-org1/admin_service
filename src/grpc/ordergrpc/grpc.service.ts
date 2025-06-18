import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import {
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
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  OrderRequest,
  IOrderService as IOrderGrpcService,
} from '../../interfaces/order.interface';

interface OrderGrpcClient {
  // refundOrder(request: RefundOrderRequest): Promise<RefundOrderResponse>;
  // getAllOrdersByUser(request: UserIdRequest): Promise<OrdersResponse>;
  GetOrderById(request: GetOrderRequest): Promise<OrderResponse>;
  // cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse>;
  // // exchangeOrder(request: ExchangeOrderRequest): Promise<ExchangeOrderResponse>;
  GetAllOrders(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse>;
  UpdateOrderStatus(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse>;
  // getOrderDetails(request: OrderRequest): Promise<OrderResponse>;
}

@Injectable()
export class OrderGrpcService implements OnModuleInit {
  private orderGrpcClient: OrderGrpcClient;

  constructor(@Inject('ORDER_PACKAGE') private client: ClientGrpc) { }

  onModuleInit() {
    this.orderGrpcClient =
      this.client.getService<OrderGrpcClient>('OrderService');
  }


  async getOrderById(data: GetOrderRequest): Promise<OrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.GetOrderById(data)).pipe(
        map((response) => response),
      ),
    );
  }

  // async cancelOrder(data: CancelOrderRequest): Promise<CancelOrderResponse> {
  //   return await lastValueFrom(
  //     from(this.orderGrpcClient.cancelOrder(data)).pipe(
  //       map((response) => response),
  //     ),
  //   );
  // }

  // async exchangeOrder(
  //   data: ExchangeOrderRequest,
  // ): Promise<ExchangeOrderResponse> {
  //   return await lastValueFrom(
  //     from(this.orderGrpcClient.exchangeOrder(data)).pipe(
  //       map((response) => response),
  //     ),
  //   );
  // }

  // async getAllOrders(data: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
  //   return await lastValueFrom(
  //     from(this.orderGrpcClient.GetAllOrders(data)).pipe(
  //       map((response) => response),
  //     ),
  //   );
  // }



  // In your OrderGrpcService
  async getAllOrders(data: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
    const response = await lastValueFrom(
      from(this.orderGrpcClient.GetAllOrders(data))
    );

    return {
      orders: Array.isArray(response.orders) ? response.orders : [],
      total: response.total || 0,
      page: response.page || data.page,
      totalPages: response.totalPages || 1,
    };
  }


  async updateOrderStatus(data: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.UpdateOrderStatus(data)).pipe(
        map((response) => response),
      ),
    );
  }

  // async getOrderDetails(data: OrderRequest): Promise<OrderResponse> {
  //   return await lastValueFrom(
  //     from(this.orderGrpcClient.getOrderDetails(data)).pipe(
  //       map((response) => response),
  //     ),
  //   );
  // }
}
