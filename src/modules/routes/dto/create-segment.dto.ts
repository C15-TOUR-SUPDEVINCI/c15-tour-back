import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsInt,
  IsString,
  IsIn,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GpsCoordinateInputDto {
  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  lon: number;
}

export class CreateSegmentDto {
  @ApiProperty({ example: 'uuid-v4', description: 'Route (trajet) this segment belongs to' })
  @IsUUID()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty({ example: 'uuid-v4', description: 'Departure point (pointDepart)' })
  @IsUUID()
  @IsNotEmpty()
  startPointId: string;

  @ApiProperty({ example: 'uuid-v4', description: 'Arrival point (pointArrivee)' })
  @IsUUID()
  @IsNotEmpty()
  endPointId: string;

  @ApiProperty({ example: 1, description: 'Order within the route (ordre)' })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ required: false, example: 5.2, description: 'Distance in km (distanceKm)' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  distanceKm?: number;

  @ApiProperty({ required: false, example: 30, description: 'Estimated duration in minutes (dureeEstimeeMinutes)' })
  @IsInt()
  @Min(0)
  @IsOptional()
  estimatedDurationMinutes?: number;

  @ApiProperty({
    required: false,
    type: () => GpsCoordinateInputDto,
    isArray: true,
    description: 'GPS polyline coordinates (coordonneesGPS)',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GpsCoordinateInputDto)
  @IsOptional()
  gpsCoordinates?: GpsCoordinateInputDto[];

  @ApiProperty({
    required: false,
    example: 'NATIONALE',
    enum: ['NATIONALE', 'DEPARTEMENTALE', 'AUTOROUTE'],
    description: 'Road type (typeRoute)',
  })
  @IsString()
  @IsIn(['NATIONALE', 'DEPARTEMENTALE', 'AUTOROUTE'])
  @IsOptional()
  roadType?: string;
}
