import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/admin-product/product.module';
import { ProductGrpcClientModule } from './grpc/productgrpc/productgrpc.module';
import { AdminModule } from './modules/admin-auth/admin.module';
import { AuthGrpcClientModule } from './grpc/authgrpc/auth.module';
import { OrderModule } from './modules/admin-orders/order.module';
import { UserModule } from './modules/admin-users/user.module';
import { DashboardModule } from './modules/admin-dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AdminModule,
    DashboardModule,
    UserModule,
    ProductModule,
    AuthGrpcClientModule,
    ProductGrpcClientModule,
    OrderModule,
  ],
})
export class AppModule {}
