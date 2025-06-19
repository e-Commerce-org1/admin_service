import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schema/admin.schema';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';
import { hashPassword, verifyPassword } from 'src/utils/password-utils';
import { generateOtp } from 'src/utils/otp-generator';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import { sendOtp } from 'src/providers /email /email.service';
import { RedisService } from 'src/providers /redis/redis.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    private readonly grpcClientService: GrpcClientService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(signupAdminDto: SignupAdminDto) {
    try {
      this.logger.log(`Admin signup: ${signupAdminDto.email}`);
      const { email, password, deviceId } = signupAdminDto;

      const existingAdminCount = await this.adminModel.countDocuments();
      if (existingAdminCount > 0) {
        this.logger.warn(`Admin already exists`);
        throw new ConflictException(
          'Admin already exists. Only one admin is allowed',
        );
      }

      const existingAdmin = await this.adminModel.findOne({ email });
      if (existingAdmin) {
        this.logger.warn(`Duplicate email use: ${email}`);
        throw new ConflictException('Admin already exists');
      }

      const hashedPassword = await hashPassword(password);
      const newAdmin = new this.adminModel({
        email,
        password: hashedPassword,
        role: 'admin',
      });

      const savedAdmin = await newAdmin.save();
      this.logger.log(`Admin successfully created: ${email}`);

      return {
        admin: {
          entityId: savedAdmin._id.toString(),
          email: savedAdmin.email,
          deviceId,
          role: 'admin',
        },
      };
    } catch (error) {
      this.logger.error(`Signup failed: ${signupAdminDto.email}`);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create admin account');
    }
  }

  

  async login(loginAdminDto: LoginAdminDto) {
    try {
      this.logger.log(`Login attempt: ${loginAdminDto.email}`);
      const { email, password, deviceId } = loginAdminDto;

      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        this.logger.warn(`Invalid email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await verifyPassword(password, admin.password);
      if (!passwordMatch) {
        this.logger.warn(`Invalid password: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await this.grpcClientService.getToken(
        admin._id.toString(),
        deviceId,
        'admin',
        email,
      );
      this.logger.log(`Successful login: ${email}`);

      return {
        admin: {
          email: admin.email,
          deviceId,
          role: 'admin',
          entityId: admin._id.toString(),
        },
        tokens,
      };
    } catch (error: unknown) {
      this.logger.error(`Login failed: ${loginAdminDto.email}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      this.logger.log(`Forgot password request: ${forgotPasswordDto.email}`);
      const { email } = forgotPasswordDto;

      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        this.logger.warn(`Invalid email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const otp = generateOtp();
      await this.redisService.setOtp(email, otp);
      await sendOtp(email, otp);
      this.logger.debug(`OTP sent to: ${email}`);

      const resetToken = this.jwtService.sign({ email }, { expiresIn: '15m' });
      return {
        message: 'OTP sent',
        resetToken,
      };
    } catch (error) {
      this.logger.error(`Forgot password failed`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to process forgot password',
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      this.logger.log(`Reset password attempt`);
      const { otp, newPassword, token } = resetPasswordDto;

      const decoded = this.jwtService.verify<{ email: string }>(token);
      if (!decoded?.email) {
        this.logger.warn('Invalid or expired token');
        throw new UnauthorizedException('Invalid or expired token');
      }

      const { email } = decoded;
      const storedOtp = await this.redisService.getOtp(email);
      if (!storedOtp || storedOtp !== otp) {
        this.logger.warn(`Invalid OTP for: ${email}`);
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.adminModel.updateOne({ email }, { password: hashedPassword });

      await this.redisService.deleteOtp(email);
      this.logger.log(`Password reset successful for: ${email}`);

      return { message: 'Password successfully reset' };
    } catch (error) {
      this.logger.error('Password reset failed');
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async changePassword(
    admin: AdminDocument,
    changePasswordDto: ChangePasswordDto,
  ) {
    try {
      this.logger.log(`Password change for: ${admin.email}`);
      const { currentPassword, newPassword } = changePasswordDto;

      const passwordMatch = await verifyPassword(
        currentPassword,
        admin.password,
      );
      if (!passwordMatch) {
        this.logger.warn(`Incorrect current password for: ${admin.email}`);
        throw new UnauthorizedException('Current password is incorrect');
      }

      admin.password = await hashPassword(newPassword);
      await admin.save();
      this.logger.log(`Password changed for: ${admin.email}`);

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error(`Password change failed`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async logout(accessToken: string) {
    try {
      this.logger.log('Logout request');
      console.log('servicetoken', accessToken);
      const result = await this.grpcClientService
        .logout({ accessToken })
      // .catch((err) => {
      //   this.logger.error('GRPC Logout error', err);
      //   throw err;
      // });
      console.log("resultfghhhj", result)

      this.logger.log(`Logout ${result.success ? 'successful' : 'failed'}`);
      //  console.log("qwertyuiop")
      // return {
      //   success: result.success,
      //   message: result.success ? 'Logged out successfully' : 'Logout failed',
      // };
      console.log(result)
      return result
    } catch (error) {
      this.logger.error('Logout failed');
      throw new InternalServerErrorException('Failed to logout', error);
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      this.logger.log('Refresh token request');
      const result = await this.grpcClientService.accessToken({
        refreshToken: refreshTokenDto.refreshToken,
      });
      this.logger.log('Token refreshed successfully');
      return result;
    } catch (error) {
      this.logger.error('Token refresh failed');
      throw new InternalServerErrorException('Failed to refresh token', error);
    }
  }

  async validateToken(accessToken: string) {
    try {
      this.logger.debug('Token validation request');
      const result = await this.grpcClientService.validateToken({
        accessToken,
      });
      this.logger.debug(`Token validation result: ${result.isValid}`);
      return result;
    } catch (error) {
      this.logger.error('Token validation failed');
      throw new InternalServerErrorException('Token validation failed', error);
    }
  }
}
