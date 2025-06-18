import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductGrpcClientModule } from '../../grpc/productgrpc/productgrpc.module';
import { AuthGrpcClientModule } from 'src/grpc/authgrpc/auth.module';
import { AdminModule } from '../admin-auth/admin.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    CloudinaryModule,
    ProductGrpcClientModule,
    AuthGrpcClientModule,
    AdminModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
