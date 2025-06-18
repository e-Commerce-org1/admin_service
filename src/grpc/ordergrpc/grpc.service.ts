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
  refundOrder(request: RefundOrderRequest): Promise<RefundOrderResponse>;
  getAllOrdersByUser(request: UserIdRequest): Promise<OrdersResponse>;
  getOrderById(request: GetOrderRequest): Promise<OrderResponse>;
  cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse>;
  exchangeOrder(request: ExchangeOrderRequest): Promise<ExchangeOrderResponse>;
  getAllOrders(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse>;
  updateOrderStatus(
    request: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse>;
  getOrderDetails(request: OrderRequest): Promise<OrderResponse>;
}

@Injectable()
export class OrderGrpcService implements OnModuleInit, IOrderGrpcService {
  private orderGrpcClient: OrderGrpcClient;

  constructor(@Inject('ORDER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.orderGrpcClient =
      this.client.getService<OrderGrpcClient>('OrderService');
  }

  async refundOrder(data: RefundOrderRequest): Promise<RefundOrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.refundOrder(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async getAllOrdersByUser(data: UserIdRequest): Promise<OrdersResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.getAllOrdersByUser(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async getOrderById(data: GetOrderRequest): Promise<OrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.getOrderById(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async cancelOrder(data: CancelOrderRequest): Promise<CancelOrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.cancelOrder(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async exchangeOrder(
    data: ExchangeOrderRequest,
  ): Promise<ExchangeOrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.exchangeOrder(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async getAllOrders(data: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.getAllOrders(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async updateOrderStatus(
    data: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.updateOrderStatus(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async getOrderDetails(data: OrderRequest): Promise<OrderResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.getOrderDetails(data)).pipe(
        map((response) => response),
      ),
    );
  }
}
