import { ApiProperty } from '@nestjs/swagger';
import { ParticipationStatus } from '../entities/participation.entity';

export class ParticipationResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ nullable: true, example: 'uuid-v4', description: 'Present for registered users' })
  userId: string;

  @ApiProperty({ example: 'uuid-v4' })
  eventId: string;

  @ApiProperty({ nullable: true, example: 'anon-device-uuid', description: 'Device UUID for anonymous participants' })
  anonymousId: string;

  @ApiProperty({ example: '2025-06-01T08:00:00.000Z' })
  registrationDate: Date;

  @ApiProperty({ enum: ParticipationStatus, example: ParticipationStatus.REGISTERED })
  status: ParticipationStatus;

  @ApiProperty({ nullable: true, example: 48.8566 })
  currentLat: number;

  @ApiProperty({ nullable: true, example: 2.3522 })
  currentLon: number;

  @ApiProperty({ nullable: true, example: '2025-06-01T09:30:00.000Z' })
  lastPositionUpdate: Date;

  @ApiProperty({ nullable: true, example: 'uuid-v4', description: 'ID of the last reached waypoint' })
  currentPointId: string;

  @ApiProperty({ example: 0, description: 'Route completion percentage (0-100)' })
  progressPercentage: number;

  @ApiProperty({ example: false })
  hasFinished: boolean;
}
