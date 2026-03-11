import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'Grand Tour C15 2024' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Convoi annuel des Citroën C15' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-12-25T10:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ required: false, example: '2024-12-25T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false, example: 50 })
  @IsInt()
  @Min(1)
  @IsOptional()
  maxParticipants?: number;

  @ApiProperty({ example: 'uuid-of-organizer' })
  @IsString()
  @IsNotEmpty()
  organizerId: string;
}
