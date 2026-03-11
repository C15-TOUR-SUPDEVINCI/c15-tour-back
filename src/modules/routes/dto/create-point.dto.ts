import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PointType } from '../entities/point.entity';

export class CreatePointDto {
  @ApiProperty({ example: 'uuid-of-route' })
  @IsString()
  @IsNotEmpty()
  routeId: string;

  @ApiProperty({ enum: PointType, default: PointType.PASSAGE })
  @IsEnum(PointType)
  type: PointType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ example: 48.8566 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ required: false, example: 'Place de la Bastille' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: '123 Rue de la Paix, Paris' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
    example: 30,
    description: 'Required when type is PAUSE',
  })
  @ValidateIf((o) => o.type === PointType.PAUSE)
  @IsInt()
  @Min(1)
  pauseDurationMinutes?: number;
}
