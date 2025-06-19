import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductServiceGrpc } from '../../interfaces/productinterface';

@Injectable()
export class GrpcProductService implements OnModuleInit {
  private productService: ProductServiceGrpc;

  constructor(@Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceGrpc>('ProductService');
  }
}
