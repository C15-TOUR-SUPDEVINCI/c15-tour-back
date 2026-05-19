import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { SegmentsService } from './segments.service';
import { SegmentsController } from './segments.controller';
import { Route } from './entities/route.entity';
import { Point } from './entities/point.entity';
import { Segment } from './entities/segment.entity';
import { MappingService } from './mapping/mapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Point, Segment]), ConfigModule],
  controllers: [RoutesController, PointsController, SegmentsController],
  providers: [RoutesService, PointsService, SegmentsService, MappingService],
  exports: [RoutesService, SegmentsService, MappingService],
})
export class RoutesModule {}
