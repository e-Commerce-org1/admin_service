import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { GrpcProductService } from './product.grpc-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'product',
            protoPath: join(__dirname, './product.proto'),
            url: configService.get<string>('PRODUCT_SERVICE_URL'),
          },
        }),
      },
    ]),
  ],
  providers: [GrpcProductService],
  exports: [GrpcProductService,ClientsModule],
})
export class ProductGrpcClientModule {}