import { ApiProperty } from '@nestjs/swagger';
import { RouteType, DifficultyLevel } from '../entities/route.entity';
import { PointResponseDto } from './point-response.dto';
import { SegmentResponseDto } from './segment-response.dto';

export class RouteResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ nullable: true, example: 'uuid-v4' })
  eventId: string;

  @ApiProperty({ nullable: true, example: 'Circuit des châteaux' })
  name: string;

  @ApiProperty({ nullable: true, example: 'Parcours à travers les châteaux de la Loire' })
  description: string;

  @ApiProperty({ nullable: true, example: 42.5 })
  totalDistanceKm: number;

  @ApiProperty({ nullable: true, example: 360 })
  estimatedDurationMinutes: number;

  @ApiProperty({ enum: RouteType, example: RouteType.MIXED })
  routeType: RouteType;

  @ApiProperty({ enum: DifficultyLevel, example: DifficultyLevel.MEDIUM })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ type: () => PointResponseDto, isArray: true })
  points: PointResponseDto[];

  @ApiProperty({ type: () => SegmentResponseDto, isArray: true })
  segments: SegmentResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
