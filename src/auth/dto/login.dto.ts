import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessages } from '../../common/enums';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail({}, { message: ValidationMessages.EMAIL_VALID })
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @MinLength(6, { message: ValidationMessages.PASSWORD_MIN_LENGTH })
  password: string;
}
