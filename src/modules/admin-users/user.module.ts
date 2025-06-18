import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AdminModule } from 'src/modules/admin-auth/admin.module';
import { UserService } from './user.service';
import { UserAdminGrpcModule } from 'src/grpc/usergrpc/grpc.module';

@Module({
  imports: [AdminModule, UserAdminGrpcModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
