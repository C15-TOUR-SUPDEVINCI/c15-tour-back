import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParticipationDto {
  @ApiProperty({ example: 'C15AB7', description: 'Event share code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    required: false,
    example: 'unique-device-uuid',
    description: 'Anonymous device identifier',
  })
  @IsString()
  @IsOptional()
  anonymousId?: string;

  @ApiProperty({
    required: false,
    example: 'uuid-of-user',
    description: 'User ID if authenticated participant',
  })
  @IsString()
  @IsOptional()
  userId?: string;
}
