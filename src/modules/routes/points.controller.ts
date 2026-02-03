import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PointsService } from './points.service';
import { Point } from './entities/point.entity';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  create(@Body() point: Partial<Point>) {
    return this.pointsService.create(point);
  }

  @Get()
  findAll(@Query('routeId') routeId?: string) {
    if (routeId) {
      return this.pointsService.findByRoute(routeId);
    }
    return this.pointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() point: Partial<Point>) {
    return this.pointsService.update(id, point);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointsService.remove(id);
  }
}
