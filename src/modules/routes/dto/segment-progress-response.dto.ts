import { ApiProperty } from '@nestjs/swagger';

export class SegmentProgressResponseDto {
  @ApiProperty({ example: true, description: 'Whether the position is on or near this segment (within 50m)' })
  isOnSegment: boolean;

  @ApiProperty({ example: 12.5, description: 'Straight-line distance from the nearest polyline point, in meters' })
  distanceFromSegmentMeters: number;

  @ApiProperty({ example: 42.0, description: 'Estimated completion percentage of this segment (0-100)' })
  progressPercentage: number;
}
