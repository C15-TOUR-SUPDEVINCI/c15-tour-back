import { ApiProperty } from '@nestjs/swagger';

export class RealTimePositionResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  participationId: string;

  @ApiProperty({ example: 48.8566 })
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  longitude: number;

  @ApiProperty({ nullable: true, example: 15.5, description: 'Speed in km/h' })
  speed: number;

  @ApiProperty({ nullable: true, example: 180, description: 'Heading in degrees (0-360)' })
  heading: number;

  @ApiProperty({ nullable: true, example: 120.5, description: 'Altitude in meters' })
  altitude: number;

  @ApiProperty({ nullable: true, example: 5.0, description: 'GPS accuracy in meters' })
  accuracy: number;

  @ApiProperty({ example: '2025-06-01T09:30:00.000Z' })
  timestamp: Date;
}
