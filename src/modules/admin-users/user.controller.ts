import { Controller, Get, HttpStatus, Inject, LoggerService, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

class UserResponse {
   users: UserResponse[];
}

class UserListResponse {
  users: UserResponse[];
  total: number;
}

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin/users')
export class UserController {
  constructor(
    private readonly userAdminService: UserService
  ) {}
  

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: UserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.getUserById({ userId: id });
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  @Get()
  async getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
    try {
      return await this.userAdminService.getAllUsers({ page: page, limit: limit });
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }

  @Get('/search')
  async searchUsers(
    @Query('query') query: string,
    @Query('status') status: 'active' | 'inactive' | 'block',
    @Query('limit') limit: number
  ) {
    try {
      return await this.userAdminService.searchUsers({ query, status, limit });
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  @Put('block/:id')
  async blockUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.updateUserStatus({
        userId: id,
      });
    } catch (error) {
      throw new Error(`Failed to block user: ${error.message}`);
    }
  }

  @Put('unblock/:id')
  async unblockUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.unblockUser({ userId: id });
    } catch (error) {
      throw new Error(`Failed to unblock user: ${error.message}`);
    }
  }



}
