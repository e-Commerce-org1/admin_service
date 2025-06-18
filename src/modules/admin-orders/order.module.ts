import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGrpcModule } from '../../grpc/ordergrpc/grpc.module';

@Module({
  imports: [OrderGrpcModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
