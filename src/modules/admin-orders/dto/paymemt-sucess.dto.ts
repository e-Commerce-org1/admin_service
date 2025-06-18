import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentSuccessDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}
