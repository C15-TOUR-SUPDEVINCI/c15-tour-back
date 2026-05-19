import { ApiProperty } from '@nestjs/swagger';
import { PointType } from '../entities/point.entity';

export class PointResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  routeId: string;

  @ApiProperty({ enum: PointType, example: PointType.PASSAGE })
  type: PointType;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 48.8566 })
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  longitude: number;

  @ApiProperty({ nullable: true, example: 'Point de départ' })
  name: string;

  @ApiProperty({ nullable: true, example: '1 Place du Général de Gaulle, Paris' })
  address: string;

  @ApiProperty({ nullable: true, example: 'Départ depuis la place principale' })
  description: string;

  @ApiProperty({ nullable: true, example: 15, description: 'Required when type is PAUSE' })
  pauseDurationMinutes: number;

  @ApiProperty({ nullable: true, example: 30 })
  estimatedTimeFromPreviousMinutes: number;

  @ApiProperty({ nullable: true, example: 5.2 })
  distanceFromPreviousKm: number;

  @ApiProperty({ nullable: true, example: '2025-06-01T10:30:00.000Z' })
  estimatedArrival: Date;

  @ApiProperty({ example: false })
  isReached: boolean;
}
