import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupAdminDto } from './dto/signup-admin.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponses } from '../../interfaces/auth.interface';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { AdminDocument } from '../../schema/admin.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Headers } from '@nestjs/common';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Admin - Login Management')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged in successfully',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(@Body() loginAdminDto: LoginAdminDto): Promise<LoginResponses> {
    return await this.adminService.login(loginAdminDto);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin change password' })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Current password and new password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
    schema: {
      example: {
        success: true,
        message: 'Password changed successfully',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials or not logged in',
    schema: {
      example: {
        statusCode: 401,
        message: 'Current password is incorrect',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'currentPassword must be a string',
          'newPassword must be a string',
        ],
        error: 'Bad Request',
      },
    },
  })
  async changePassword(
    admin: AdminDocument,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const result = await this.adminService.changePassword(
      admin,
      changePasswordDto,
    );
    return {
      success: true,
      message: result.message,
      data: result,
    };
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Admin forgot password',
    description: 'Send reset password OTP to admin email',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'If this email exists, OTP has been sent',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.adminService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password with OTP',
    description: 'Verify OTP and set new password. ',
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful',
    schema: {
      example: { message: 'Password successfully reset' },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid OTP or expired',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.adminService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Log out admin user',
    description: 'Invalidates the current session for the specified device',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid token or missing required fields',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid token payload: missing required fields',
        error: 'Unauthorized',
      },
    },
  })
  async logout(@Request() req) {
    // if (!authHeader) {
    //   throw new UnauthorizedException('Authorization header is required');
    // }
    // const token = authHeader?.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException('Invalid Bearer token format');
    // }
    // return this.adminService.logout(token);
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace('Bearer ', '');
    const result = await this.adminService.logout(accessToken);
    return result;
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh an access token using a refresh token' })
  @ApiBody({
    description: 'Refresh token data',
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          description: 'The refresh token used to obtain a new access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token refreshed successfully' },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.adminService.refreshToken(refreshTokenDto);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    };
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate an access token' })
  @ApiBody({
    description: 'Access token data',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'The access token to validate',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['accessToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Token validation completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token validation completed' },
        data: {
          type: 'object',
          properties: {
            isValid: { type: 'boolean', example: true },
            admin: { type: 'string', example: 'admin123' },
          },
        },
      },
    },
  })
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    const result = await this.adminService.validateToken(
      validateTokenDto.accessToken,
    );

    return {
      success: true,
      message: 'Token validation completed',
      data: result,
    };
  }
}
