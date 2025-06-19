import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderGrpcService } from './grpc.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'ORDER_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'order',
            protoPath: join(__dirname, 'order.proto'),
            url: configService.get<string>('ORDER_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [OrderGrpcService],
  exports: [OrderGrpcService],
})
export class OrderGrpcModule { }