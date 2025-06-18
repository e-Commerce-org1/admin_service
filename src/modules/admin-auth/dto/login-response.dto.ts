export class LoginResponseDto {
  admin: {
    email: string;
    deviceId?: string;
    role: string;
    entityId: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
