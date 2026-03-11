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
} from '@nestjs/swagger';
import { PointsService } from './points.service';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('points')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a point (PASSAGE, INTERET, or PAUSE)' })
  create(@Body() createPointDto: CreatePointDto) {
    return this.pointsService.create(createPointDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all points, optionally filtered by routeId' })
  @ApiQuery({ name: 'routeId', required: false })
  findAll(@Query('routeId') routeId?: string) {
    if (routeId) {
      return this.pointsService.findByRoute(routeId);
    }
    return this.pointsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get point by ID' })
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update point' })
  update(@Param('id') id: string, @Body() updatePointDto: UpdatePointDto) {
    return this.pointsService.update(id, updatePointDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete point' })
  remove(@Param('id') id: string) {
    return this.pointsService.remove(id);
  }
}
