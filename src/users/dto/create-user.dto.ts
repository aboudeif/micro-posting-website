import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ValidationMessages } from '../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString({ message: ValidationMessages.NAME_STRING })
  @IsNotEmpty({ message: ValidationMessages.NAME_REQUIRED })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail({}, { message: ValidationMessages.EMAIL_VALID })
  @IsNotEmpty({ message: ValidationMessages.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString({ message: ValidationMessages.PASSWORD_STRING })
  @MinLength(6, { message: ValidationMessages.PASSWORD_MIN_LENGTH })
  password: string;
}
