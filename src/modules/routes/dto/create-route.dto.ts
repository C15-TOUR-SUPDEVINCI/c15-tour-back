import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RouteType, DifficultyLevel } from '../entities/route.entity';

export class CreateRouteDto {
  @ApiProperty({ example: 'uuid-of-event' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ required: false, example: 'Route principale' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: RouteType, default: RouteType.MIXED })
  @IsEnum(RouteType)
  @IsOptional()
  routeType?: RouteType;

  @ApiProperty({ enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  @IsEnum(DifficultyLevel)
  @IsOptional()
  difficultyLevel?: DifficultyLevel;

  @ApiProperty({ required: false, example: 85.5 })
  @IsNumber()
  @IsOptional()
  totalDistanceKm?: number;

  @ApiProperty({ required: false, example: 135 })
  @IsNumber()
  @IsOptional()
  estimatedDurationMinutes?: number;
}
