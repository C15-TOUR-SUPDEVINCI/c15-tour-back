import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '../entities/event.entity';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class EventResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Tour de Bretagne' })
  title: string;

  @ApiProperty({ nullable: true, example: 'Une randonnée à travers la Bretagne' })
  description: string;

  @ApiProperty({ example: 'AB12CD34', description: '8-character share code for participant joins' })
  shareCode: string;

  @ApiProperty({ example: '2025-06-01T08:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ nullable: true, example: '2025-06-01T18:00:00.000Z' })
  endDate: Date;

  @ApiProperty({ nullable: true, example: 360 })
  estimatedDurationMinutes: number;

  @ApiProperty({ nullable: true, example: 42.5 })
  totalDistanceKm: number;

  @ApiProperty({ enum: EventStatus, example: EventStatus.DRAFT })
  status: EventStatus;

  @ApiProperty({ example: 100 })
  maxParticipants: number;

  @ApiProperty({ example: 0 })
  currentParticipantsCount: number;

  @ApiProperty({ nullable: true, example: 'https://stream.example.com/live' })
  audioStreamUrl: string;

  @ApiProperty({ example: false })
  isAudioStreamActive: boolean;

  @ApiProperty({ example: 'uuid-v4' })
  organizerId: string;

  @ApiProperty({ type: () => UserResponseDto, nullable: true })
  organizer: UserResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
