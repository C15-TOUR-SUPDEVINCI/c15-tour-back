import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRealTimePositionDto {
  @ApiProperty({ example: 'uuid-v4', description: 'ID of the participation this position belongs to' })
  @IsUUID()
  @IsNotEmpty()
  participationId: string;

  @ApiProperty({ example: 48.8566, description: 'Latitude (-90 to 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 2.3522, description: 'Longitude (-180 to 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @ApiProperty({ required: false, example: 15.5, description: 'Speed in km/h' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  speed?: number;

  @ApiProperty({ required: false, example: 180, description: 'Heading in degrees (0-360)' })
  @IsNumber()
  @Min(0)
  @Max(360)
  @IsOptional()
  heading?: number;

  @ApiProperty({ required: false, example: 120.5, description: 'Altitude in meters' })
  @IsNumber()
  @IsOptional()
  altitude?: number;

  @ApiProperty({ required: false, example: 5.0, description: 'GPS accuracy in meters' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  accuracy?: number;
}
