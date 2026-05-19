import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { RealTimePositionService } from './real-time-position.service';
import { RealTimePosition } from './entities/real-time-position.entity';
import { RealTimePositionResponseDto } from './dto/real-time-position-response.dto';

@ApiTags('positions')
@Controller('positions')
export class RealTimePositionController {
  constructor(private readonly positionsService: RealTimePositionService) {}

  @Post()
  @ApiOperation({ summary: 'Record a GPS position for a participation' })
  @ApiCreatedResponse({ type: RealTimePositionResponseDto })
  create(@Body() position: Partial<RealTimePosition>) {
    return this.positionsService.create(position);
  }

  @Get()
  @ApiOperation({ summary: 'Get all positions, optionally filtered by participationId' })
  @ApiQuery({ name: 'participationId', required: false })
  @ApiOkResponse({ type: RealTimePositionResponseDto, isArray: true })
  findAll(@Query('participationId') participationId?: string) {
    if (participationId) {
      return this.positionsService.findByParticipation(participationId);
    }
    return this.positionsService.findAll();
  }
}
