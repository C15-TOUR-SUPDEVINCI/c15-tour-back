import { ApiProperty } from '@nestjs/swagger';

export class GpsCoordinateDto {
  @ApiProperty({ example: 48.8566 })
  lat: number;

  @ApiProperty({ example: 2.3522 })
  lon: number;
}

export class SegmentResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'uuid-v4' })
  routeId: string;

  @ApiProperty({ example: 'uuid-v4' })
  startPointId: string;

  @ApiProperty({ example: 'uuid-v4' })
  endPointId: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 5.2 })
  distanceKm: number;

  @ApiProperty({ example: 30 })
  estimatedDurationMinutes: number;

  @ApiProperty({ type: () => GpsCoordinateDto, isArray: true, nullable: true })
  gpsCoordinates: GpsCoordinateDto[];

  @ApiProperty({ nullable: true, example: 'primary' })
  roadType: string;
}
