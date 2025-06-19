import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardStats } from 'src/interfaces/dashboard.interface';
import { DashboardService } from './dashboard.service';

class DashboardStatsResponse implements DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: string;
}

@ApiTags('Admin Dashboard')
@ApiBearerAuth()
@Controller('admin/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved dashboard stats',
    type: DashboardStatsResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      this.logger.log('Fetching dashboard statistics...');
      const stats = await this.dashboardService.getDashboardStats();
      this.logger.log('Successfully fetched dashboard statistics');
      return stats;
    } catch (error) {
      this.logger.error(`Failed to fetch dashboard statistics: ${error}`);
      throw error;
    }
  }
}
