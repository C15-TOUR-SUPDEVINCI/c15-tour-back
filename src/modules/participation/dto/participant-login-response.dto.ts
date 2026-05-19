import { ApiProperty } from '@nestjs/swagger';
import { ParticipationResponseDto } from './participation-response.dto';

export class ParticipantLoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ type: () => ParticipationResponseDto })
  participation: ParticipationResponseDto;
}
