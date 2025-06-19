import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetOrderRequest,
  OrderResponse,
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from '../../interfaces/order.interface';

interface OrderGrpcClient {
  GetOrderById(request: GetOrderRequest): Promise<OrderResponse>;
  GetAllOrders(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse>;
  UpdateOrderStatus(
    request: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse>;
}

@Injectable()
export class OrderGrpcService implements OnModuleInit {
  private orderGrpcClient: OrderGrpcClient;

  constructor(@Inject('ORDER_PACKAGE') private client: ClientGrpc) {}

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

  async getAllOrders(data: GetAllOrdersRequest): Promise<GetAllOrdersResponse> {
    const response = await lastValueFrom(
      from(this.orderGrpcClient.GetAllOrders(data)),
    );

    return {
      orders: Array.isArray(response.orders) ? response.orders : [],
      total: response.total || 0,
      page: response.page || data.page,
      totalPages: response.totalPages || 1,
    };
  }

  async updateOrderStatus(
    data: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse> {
    return await lastValueFrom(
      from(this.orderGrpcClient.UpdateOrderStatus(data)).pipe(
        map((response) => response),
      ),
    );
  }
}
