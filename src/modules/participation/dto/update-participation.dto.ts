import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ParticipationStatus } from '../entities/participation.entity';

export class UpdateParticipationDto {
  @ApiProperty({ enum: ParticipationStatus, required: false })
  @IsEnum(ParticipationStatus)
  @IsOptional()
  status?: ParticipationStatus;

  @ApiProperty({ required: false, example: 48.8566, description: 'Latitude (-90 to 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  @IsOptional()
  currentLat?: number;

  @ApiProperty({ required: false, example: 2.3522, description: 'Longitude (-180 to 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  currentLon?: number;

  @ApiProperty({ required: false, example: 'uuid-v4', description: 'ID of the current waypoint reached' })
  @IsUUID()
  @IsOptional()
  currentPointId?: string;

  @ApiProperty({ required: false, example: 42.5, description: 'Route completion percentage (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercentage?: number;

  @ApiProperty({ required: false, example: false })
  @IsBoolean()
  @IsOptional()
  hasFinished?: boolean;
}
