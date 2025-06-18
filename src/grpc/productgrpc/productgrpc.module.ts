import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { GrpcProductService } from './product.grpc-client';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(__dirname, './product.proto'),
          url: '0.0.0.0:5001',
        },
      },
    ]),
  ],
  providers: [GrpcProductService],
  exports: [ClientsModule, GrpcProductService],
})
export class ProductGrpcClientModule {}
