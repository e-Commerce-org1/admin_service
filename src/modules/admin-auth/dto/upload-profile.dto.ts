import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  adminid: string;
}
