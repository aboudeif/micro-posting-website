import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessages } from '../../common/enums';

export class CreatePostDto {
  @ApiProperty({ example: 'Hello world', description: 'The content of the post' })
  @IsString({ message: ValidationMessages.CONTENT_STRING })
  @IsNotEmpty({ message: ValidationMessages.CONTENT_REQUIRED })
  content: string;
}
