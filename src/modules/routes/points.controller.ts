import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PointResponseDto } from './dto/point-response.dto';

@ApiTags('points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a point (PASSAGE, INTERET, or PAUSE)' })
  @ApiCreatedResponse({ type: PointResponseDto })
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.create(createPointDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all points, optionally filtered by routeId' })
  @ApiQuery({ name: 'routeId', required: false })
  @ApiOkResponse({ type: PointResponseDto, isArray: true })
  findAll(@Query('routeId') routeId?: string) {
    if (routeId) {
      return this.pointsService.findByRoute(routeId);
    }
    return this.pointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get point by ID' })
  @ApiOkResponse({ type: PointResponseDto })
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update point' })
  @ApiOkResponse({ type: PointResponseDto })
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.update(id, updatePointDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete point' })
  @ApiOkResponse({ description: 'Point deleted successfully' })
  remove(@Param('id') id: string) {
    return this.pointsService.remove(id);
  }
}
