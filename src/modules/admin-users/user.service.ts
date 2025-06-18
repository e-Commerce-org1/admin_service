import { Injectable, Logger } from '@nestjs/common';
import { UserAdminGrpcService } from '../../grpc/usergrpc/grpc.service';
import {
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnblockUserRequest,
  UnblockUserResponse,
} from '../../interfaces/user.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userAdminGrpcService: UserAdminGrpcService) {}

  async getAllUsers(params: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    this.logger.log(
      `Starting to fetch all users with params: ${JSON.stringify(params)}`,
    );

    try {
      const result = await this.userAdminGrpcService.getAllUsers(params);
      this.logger.log(`Successfully fetched ${result.users?.length} users`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error}`);
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  async getUserById(params: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    this.logger.log(`Fetching user by ID: ${params.userId}`);

    try {
      if (!params.userId) {
        this.logger.warn('Attempted to fetch user without providing ID');
        throw new Error('User ID is required');
      }

      const result = await this.userAdminGrpcService.getUserById(params);
      this.logger.log(`Successfully fetched user ${params.userId}`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${params.userId}: ${error}`);
      throw new Error(`Failed to fetch user ${params.userId}: ${error}`);
    }
  }

  async updateUserStatus(
    params: UpdateUserStatusRequest,
  ): Promise<UpdateUserStatusResponse> {
    this.logger.log(`Updating status for user ${params.userId}`);

    try {
      if (!params.userId) {
        this.logger.warn('Attempted status update without user ID');
        throw new Error('User ID is required');
      }

      const result = await this.userAdminGrpcService.updateUserStatus(params);
      this.logger.log(`Successfully updated status for user ${params.userId}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update status for user ${params.userId}: ${error}`,
      );
      throw new Error(
        `Failed to update status for user ${params.userId}: ${error}`,
      );
    }
  }

  async searchUsers(params: SearchUsersRequest): Promise<SearchUsersResponse> {
    this.logger.log(`Searching users with query: ${params.query}`);

    try {
      if (!params.query) {
        this.logger.warn('Attempted search without query parameters');
        throw new Error('Search query or filters are required');
      }

      const result = await this.userAdminGrpcService.searchUsers(params);
      this.logger.log(
        `Search completed with ${result.users?.length || 0} results`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to search users: ${error}`);
      throw new Error(`Failed to search users: ${error}`);
    }
  }

  async unblockUser(params: UnblockUserRequest): Promise<UnblockUserResponse> {
    this.logger.log(`Unblocking user with ID: ${params.userId}`);

    try {
      if (!params.userId) {
        this.logger.warn('Attempted to unblock user without providing ID');
        throw new Error('User ID is required');
      }

      const result = await this.userAdminGrpcService.unblockUser(params);
      this.logger.log(`Successfully unblocked user ${params.userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to unblock user ${params.userId}: ${error}`);
      throw new Error(`Failed to unblock user ${params.userId}: ${error}`);
    }
  }
}
