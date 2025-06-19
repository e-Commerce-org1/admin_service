import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdRequest,
  GetUserByIdResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
  SearchUsersRequest,
  SearchUsersResponse,
  UnblockUserResponse,
  UnblockUserRequest,
} from '../../interfaces/user.interface';

interface UserAdminGrpcClient {
  getAllUsers(request: GetAllUsersRequest): Promise<GetAllUsersResponse>;
  getUserById(request: GetUserByIdRequest): Promise<GetUserByIdResponse>;
  updateUserStatus(request: UpdateUserStatusRequest): Promise<UpdateUserStatusResponse>;
  unblockUser(request: UnblockUserRequest): Promise<UnblockUserResponse>;
  searchUsers(request: SearchUsersRequest): Promise<SearchUsersResponse>;
}

@Injectable()
export class UserAdminGrpcService implements OnModuleInit {
  private userAdminGrpcClient: UserAdminGrpcClient;

  constructor(@Inject('USER_ADMIN_GRPC_SERVICE') private client: ClientGrpc) { }

  onModuleInit() {
    this.userAdminGrpcClient = this.client.getService<UserAdminGrpcClient>(
      'UserAdminGrpcService',
    );
  }

  async getAllUsers(data: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    return await lastValueFrom(
      from(this.userAdminGrpcClient.getAllUsers(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async getUserById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
    return await lastValueFrom(
      from(this.userAdminGrpcClient.getUserById(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async updateUserStatus(
    data: UpdateUserStatusRequest,
  ): Promise<UpdateUserStatusResponse> {
    return await lastValueFrom(
      from(this.userAdminGrpcClient.updateUserStatus(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async searchUsers(data: SearchUsersRequest): Promise<SearchUsersResponse> {
    return await lastValueFrom(
      from(this.userAdminGrpcClient.searchUsers(data)).pipe(
        map((response) => response),
      ),
    );
  }

  async unblockUser(data: UnblockUserRequest): Promise<UnblockUserResponse> {
    return await lastValueFrom(
      from(this.userAdminGrpcClient.unblockUser(data)).pipe(
        map((response) => response),
      ),
    );
  }
}
