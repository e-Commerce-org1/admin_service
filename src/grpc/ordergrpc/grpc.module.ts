import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderGrpcService } from './grpc.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',

          protoPath: join(__dirname, 'order.proto'),
          url: '172.50.0.244:50053',
        },
      },
    ]),
  ],
  providers: [OrderGrpcService],
  exports: [OrderGrpcService],
})
export class OrderGrpcModule {}
