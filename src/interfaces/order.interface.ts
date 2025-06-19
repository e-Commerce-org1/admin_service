export interface IOrderService {
  GetOrderById(request: GetOrderRequest): Promise<OrderResponse>;
  GetAllOrders(request: GetAllOrdersRequest): Promise<GetAllOrdersResponse>;
  UpdateOrderStatus(
    request: UpdateOrderStatusRequest,
  ): Promise<UpdateOrderStatusResponse>;
}

export interface CreateOrderRequest {
  userId: string;
  address: Address;
}

export interface Address {
  name: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface CreateOrderResponse {
  orderId: string;
  sessionId: string;
  paymentUrl: string;
  totalPrice: number;
  products: ProductItem[];
}

export interface ProductItem {
  productId: string;
  description: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface PaymentSuccessRequest {
  orderId: string;
  sessionId: string;
  status: string;
}

export interface PaymentSuccessResponse {
  success: boolean;
  orderId: string;
}

export interface RefundOrderRequest {
  orderId: string;
  userId: string;
  reason: string;
}

export interface RefundOrderResponse {
  success: boolean;
  orderId: string;
  refundId: string;
  message: string;
}

export interface UserIdRequest {
  userId: string;
}

export interface OrdersResponse {
  orders: OrderResponse[];
}

export interface GetOrderRequest {
  orderId: string;
  userId: string;
}

export interface OrderResponse {
  orderId: string;
  userId: string;
  products: ProductItem[];
  address: Address;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  sessionId: string;
  paymentUrl: string;
  refundId: string;
  reviews: ReviewItem[];
  createdAt: string;
}

export interface ReviewItem {
  productId: string;
  review: string;
}

export interface CancelOrderRequest {
  orderId: string;
  userId: string;
}

export interface CancelOrderResponse {
  success: boolean;
  message: string;
}

export interface ExchangeOrderRequest {
  orderId: string;
  userId: string;
}

export interface ExchangeOrderResponse {
  success: boolean;
  message: string;
}

export interface AddReviewRequest {
  orderId: string;
  userId: string;
  productId: string;
  review: string;
}

export interface AddReviewResponse {
  success: boolean;
  message: string;
}

export interface GetAllOrdersRequest {
  page: number;
  limit: number;
}

export interface GetAllOrdersResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
}

export interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

export interface OrderRequest {
  orderId: string;
}
