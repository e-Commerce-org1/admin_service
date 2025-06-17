import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException,
  Logger 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../../schema/admin.schema';
import { SignupAdminDto } from './dto/signup-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';
import { RedisService } from 'src/providers /redis/redis.service';
import { hashPassword, verifyPassword } from 'src/utils/password-utils';
import { sendOtp } from '../../providers /email /email.service';
import { generateOtp } from 'src/utils/otp-generator';
import { ChangePasswordDto } from './dto/changepassword.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';

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
      this.logger.log(`Starting admin signup for email: ${signupAdminDto.email}`);
      const { email, password, deviceId } = signupAdminDto;

      const existingAdminCount = await this.adminModel.countDocuments();
      if (existingAdminCount > 1) {
        this.logger.warn(`Admin creation attempt when one already exists: ${email}`);
        throw new ConflictException('Admin already exists. Only one admin is allowed.');
      }

      const existingAdmin = await this.adminModel.findOne({ email });
      if (existingAdmin) {
        this.logger.warn(`Duplicate admin signup attempt: ${email}`);
        throw new ConflictException('Admin with this email already exists');
      }

      const hashedPassword = await hashPassword(password);
      const newAdmin = new this.adminModel({
        email,
        password: hashedPassword,
        role: 'admin'
      });

      const savedAdmin = await newAdmin.save();
      this.logger.log(`Admin successfully created: ${email}`);
      
      return {
        admin: {
          entityId: savedAdmin._id,
          email: savedAdmin.email,
          deviceId: deviceId,
          role: 'admin',
        }
      };
    } catch (error) {
      this.logger.error(`Signup failed for email: ${signupAdminDto.email}`, error.stack);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create admin account');
    }
  }

  async login(loginAdminDto: LoginAdminDto) {
    try {
      this.logger.log(`Login attempt for email: ${loginAdminDto.email}`);
      const { email, password, deviceId } = loginAdminDto;

      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        this.logger.warn(`Login attempt with non-existent email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await verifyPassword(password, admin.password);
      if (!passwordMatch) {
        this.logger.warn(`Invalid password attempt for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const entityId = admin._id.toString();
      const role = 'admin';

      this.logger.debug(`Requesting tokens for admin: ${email}`);
      const tokens = await this.grpcClientService.getToken(entityId, deviceId, role, email);
      this.logger.log(`Successful login for admin: ${email}`);

      return {
        admin: {
          email: admin.email,
          deviceId: deviceId,
          role,
          entityId: admin._id.toString()
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      };
    } catch (error) {
      this.logger.error(`Login failed for email: ${loginAdminDto.email}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      this.logger.log(`Forgot password request for email: ${forgotPasswordDto.email}`);
      const { email } = forgotPasswordDto;

      const admin = await this.adminModel.findOne({ email });
      if (!admin) {
        this.logger.warn(`Forgot password attempt for non-existent email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const otp = generateOtp();
      await this.redisService.setOtp(email, otp);

      await sendOtp(email, otp);
      this.logger.debug(`OTP sent to email: ${email}`);

      const resetToken = this.jwtService.sign(
        { email },
        { expiresIn: '15m' } 
      );

      return { message: "OTP sent to your email", resetToken };
    } catch (error) {
      this.logger.error(`Forgot password failed for email: ${forgotPasswordDto.email}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to process forgot password request');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      this.logger.log(`Reset password attempt with token: ${resetPasswordDto.token}`);
      const { otp, newPassword, token } = resetPasswordDto;

      let decoded: { email: string };
      try {
        decoded = this.jwtService.verify(token);
      } catch (err) {
        this.logger.warn(`Invalid or expired token used for password reset: ${token}`);
        throw new UnauthorizedException('Invalid or expired token');
      }

      const email = decoded.email;
      if (!email) {
        this.logger.warn(`Missing email in reset password token`);
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      const storedOtp = await this.redisService.getOtp(email);
      if (!storedOtp) {
        this.logger.warn(`OTP expired or not found for email: ${email}`);
        throw new UnauthorizedException('OTP expired or invalid');
      }

      if (storedOtp !== otp) {
        this.logger.warn(`Invalid OTP provided for email: ${email}`);
        throw new UnauthorizedException('Invalid OTP');
      }

      const hashedPassword = await hashPassword(newPassword);
      const updatedAdmin = await this.adminModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true },
      );

      if (!updatedAdmin) {
        this.logger.error(`Admin not found during password reset: ${email}`);
        throw new UnauthorizedException('Admin not found');
      }

      await this.redisService.deleteOtp(email);
      this.logger.log(`Password successfully reset for email: ${email}`);

      return { message: 'Password successfully reset' };
    } catch (error) {
      this.logger.error(`Password reset failed`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  async changePassword(admin: AdminDocument, changePasswordDto: ChangePasswordDto) {
    try {
      this.logger.log(`Password change request for admin: ${admin.email}`);
      const { currentPassword, newPassword } = changePasswordDto;

      const passwordMatch = await verifyPassword(currentPassword, admin.password);
      if (!passwordMatch) {
        this.logger.warn(`Incorrect current password provided for admin: ${admin.email}`);
        throw new UnauthorizedException('Current password is incorrect');
      }

      const hashedPassword = await hashPassword(newPassword);
      admin.password = hashedPassword;
      await admin.save();
      this.logger.log(`Password successfully changed for admin: ${admin.email}`);

      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error(`Password change failed for admin: ${admin.email}`, error.stack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  async logout(accessToken: string) {
    try {
      this.logger.log(`Logout request received`);
      const result = await this.grpcClientService.logout({ accessToken });

      if (result.success) {
        this.logger.log(`Successful logout`);
      } else {
        this.logger.warn(`Logout failed`);
      }

      return {
        success: result.success,
        message: result.success
          ? 'Logged out successfully'
          : 'Logout failed'
      };
    } catch (error) {
      this.logger.error(`Logout failed`, error.stack);
      throw new InternalServerErrorException('Failed to logout');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      this.logger.log(`Refresh token request received`);
      const { refreshToken } = refreshTokenDto;
      const result = await this.grpcClientService.accessToken({
        refreshToken,
      });

      this.logger.log(`Token successfully refreshed`);
      return {
        accessToken: result.accessToken
      };
    } catch (error) {
      this.logger.error(`Token refresh failed`, error.stack);
      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async validateToken(accessToken: string) {
    try {
      this.logger.debug(`Token validation request received`);
      const result = await this.grpcClientService.validateToken({
        accessToken
      });

      this.logger.debug(`Token validation result: ${result.isValid}`);
      return {
        isValid: result.isValid,
        admin: result.entityId,
      };
    } catch (error) {
      this.logger.error(`Token validation failed`, error.stack);
      throw new InternalServerErrorException('Token validation failed');
    }
  }
}