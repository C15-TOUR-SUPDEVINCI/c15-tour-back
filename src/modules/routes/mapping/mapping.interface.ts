import { Point } from '../entities/point.entity';

export interface SegmentCalculationResult {
  distanceKm: number;
  estimatedDurationMinutes: number;
  gpsCoordinates: { lat: number; lon: number }[];
  roadType: string;
}

export interface IMappingProvider {
  calculateSegment(from: Point, to: Point): Promise<SegmentCalculationResult>;
}
