import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';

class UserResponse {
  users: UserResponse[];
}

@ApiTags('Admin Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('admin/users')
export class UserController {
  constructor(private readonly userAdminService: UserService) { }



  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserResponse],
    description: 'List of users retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.userAdminService.getAllUsers({
        page: page,
        limit: limit,
      });
    } catch (error) {
      throw new Error(`Failed to get all users: ${error}`);
    }
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search users with filters' })
  @ApiQuery({
    name: 'query',
    required: false,
    type: String,
    description: 'Search query (name, email, etc.)',
  })
  // @ApiQuery({
  //   name: 'status',
  //   required: false,
  //   enum: ['active', 'inactive', 'block'],
  //   description: 'Filter by user status',
  // })
  // @ApiQuery({
  //   name: 'limit',
  //   required: false,
  //   type: Number,
  //   description: 'Maximum number of results to return',
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [UserResponse],
    description: 'Search results returned successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async searchUsers(
    @Query('query') query: string,
  ) {
    try {
      return await this.userAdminService.searchUsers({ query });
    } catch (error) {
      throw new Error(`Failed to search users: ${error}`);
    }
  }

  @Put('block/:id')
  @ApiOperation({ summary: 'Block a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID to block' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
    description: 'User blocked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async blockUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.updateUserStatus({
        userId: id,
      });
    } catch (error) {
      throw new Error(`Failed to block user: ${error}`);
    }
  }

  @Put('unblock/:id')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID to unblock' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
    description: 'User unblocked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async unblockUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.unblockUser({ userId: id });
    } catch (error) {
      throw new Error(`Failed to unblock user: ${error}`);
    }
  }

  
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
    description: 'User details retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getUser(@Param('id') id: string) {
    try {
      return await this.userAdminService.getUserById({ userId: id });
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }
}
