import { Module } from '@nestjs/common';
import { DashboardController } from '../../modules/admin-dashboard/dasboard.controller';
import { ProductModule } from 'src/modules/admin-product/product.module';
import { AdminModule } from 'src/modules/admin-auth/admin.module';
import { DashboardService } from './dashboard.service';
import { UserModule } from '../admin-users/user.module';

@Module({
  imports: [UserModule, ProductModule, AdminModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
