import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SegmentsService } from './segments.service';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { CheckProgressDto } from './dto/check-progress.dto';
import { SegmentResponseDto, GpsCoordinateDto } from './dto/segment-response.dto';
import { SegmentProgressResponseDto } from './dto/segment-progress-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('segments')
@Controller('segments')
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  // creerSegment()
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a segment manually (creerSegment)' })
  @ApiCreatedResponse({ type: SegmentResponseDto })
  create(@Body() dto: CreateSegmentDto) {
    return this.segmentsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all segments, optionally filtered by routeId' })
  @ApiQuery({ name: 'routeId', required: false })
  @ApiOkResponse({ type: SegmentResponseDto, isArray: true })
  findAll(@Query('routeId') routeId?: string) {
    if (routeId) {
      return this.segmentsService.findByRoute(routeId);
    }
    return this.segmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get segment by ID' })
  @ApiOkResponse({ type: SegmentResponseDto })
  findOne(@Param('id') id: string) {
    return this.segmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a segment' })
  @ApiOkResponse({ type: SegmentResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateSegmentDto) {
    return this.segmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a segment' })
  @ApiOkResponse({ description: 'Segment deleted successfully' })
  remove(@Param('id') id: string) {
    return this.segmentsService.remove(id);
  }

  // obtenirPolyline()
  @Get(':id/polyline')
  @ApiOperation({ summary: 'Get GPS polyline coordinates for this segment (obtenirPolyline)' })
  @ApiOkResponse({ type: GpsCoordinateDto, isArray: true })
  getPolyline(@Param('id') id: string) {
    return this.segmentsService.getPolyline(id);
  }

  // verifierProgression(position)
  @Post(':id/check-progress')
  @ApiOperation({
    summary: 'Check participant progression on this segment (verifierProgression)',
    description: 'Returns whether the GPS position is on the segment (within 50m), the distance from the nearest polyline point, and the estimated completion percentage.',
  })
  @ApiCreatedResponse({ type: SegmentProgressResponseDto })
  checkProgress(@Param('id') id: string, @Body() dto: CheckProgressDto) {
    return this.segmentsService.checkProgress(id, dto.latitude, dto.longitude);
  }
}
