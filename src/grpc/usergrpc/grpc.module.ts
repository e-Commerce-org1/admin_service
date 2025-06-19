import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserAdminGrpcService } from './grpc.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync([
      {
        name: 'USER_ADMIN_GRPC_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: configService.get<string>('USER_SERVICE_URL'),
            package: 'useradmin',
            protoPath: join(__dirname, 'user.proto'),
          },
        }),
      },
    ]),
  ],
  providers: [UserAdminGrpcService],
  exports: [UserAdminGrpcService],
})
export class UserAdminGrpcModule {}