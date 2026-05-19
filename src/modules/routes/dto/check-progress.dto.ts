import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckProgressDto {
  @ApiProperty({ example: 48.8566, description: 'Current latitude (-90 to 90)' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ example: 2.3522, description: 'Current longitude (-180 to 180)' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
