// src/grpc/product/product-grpc.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  ProductServiceGrpc,
  CreateProductRequest,
  UpdateProductRequest,
  ProductID,
  ProductFilter,
  UpdateInventoryRequest,
  Response
} from '../../interfaces/productinterface';

@Injectable()
export class GrpcProductService implements OnModuleInit {
  private productService: ProductServiceGrpc;

  constructor(
    @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceGrpc>('ProductService');
  }

  // async createProduct(payload: CreateProductRequest): Promise<Response> {
  //   return lastValueFrom(this.productService.CreateProduct(payload));
  // }

  // async updateProduct(payload: UpdateProductRequest): Promise<Response> {
  //   return lastValueFrom(this.productService.UpdateProduct(payload));
  // }

  // async getProduct(payload: ProductID): Promise<Response> {
  //   return lastValueFrom(this.productService.GetProduct(payload));
  // }

  // async deleteProduct(payload: ProductID): Promise<Response> {
  //   return lastValueFrom(this.productService.DeleteProduct(payload));
  // }

  // async listProducts(payload: ProductFilter): Promise<Response> {
  //   return lastValueFrom(this.productService.ListProducts(payload));
  // }

  // async updateInventory(payload: UpdateInventoryRequest): Promise<Response> {
  //   return lastValueFrom(this.productService.UpdateInventory(payload));
  // }
}