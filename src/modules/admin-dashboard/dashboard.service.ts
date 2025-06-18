import { Injectable, Logger } from '@nestjs/common';
import { ProductService } from 'src/modules/admin-product/product.service';
import {
  DashboardStats,
  ProductListResponse,
} from 'src/interfaces/dashboard.interface';
import { UserService } from '../admin-users/user.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  private isProductListResponse(data: any): data is ProductListResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'total' in data &&
      typeof data.total === 'number'
    );
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const usersResponse = await this.userService.getAllUsers({
        page: 1,
        limit: 1,
      });

      const productResponse = await this.productService.listProducts({
        page: 1,
        pageSize: 1,
      });

      if (!this.isProductListResponse(productResponse.data)) {
        this.logger.error('Invalid product data', productResponse.data);
        throw new Error('Invalid product data');
      }

      this.logger.log('Successfully compiled dashboard statistics');

      return {
        totalOrders: 300,
        totalProducts: productResponse.data.total,
        totalUsers: usersResponse.total,
        totalRevenue: '504694',
      };
    } catch (error) {
      this.logger.error('Failed to fetch dashboard stats', error);
      throw new Error(
        'Failed to load dashboard statistics. Please try again later.',
      );
    }
  }
}
