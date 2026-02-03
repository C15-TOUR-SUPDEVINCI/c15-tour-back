import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginParticipantDto {
  @ApiProperty({ example: 'C15TOUR', description: 'Event share code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'uuid-v4-string',
    description: 'Anonymous ID stored on device',
    required: false,
  })
  @IsString()
  @IsOptional()
  anonymousId?: string;
}
