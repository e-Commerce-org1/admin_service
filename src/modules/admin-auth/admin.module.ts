import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schema/admin.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from '../../utils/jwt.strategy';
import { RedisModule } from '../../providers /redis/redis.module';
import { AuthGrpcClientModule } from '../../grpc/authgrpc/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'akshitbansal',
      signOptions: { expiresIn: '15m' },
    }),
    AuthGrpcClientModule,
    RedisModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService],
})
export class AdminModule {}
