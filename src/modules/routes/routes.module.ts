import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PointsService } from './points.service';
import { PointsController } from './points.controller';
import { Route } from './entities/route.entity';
import { Point } from './entities/point.entity';
import { Segment } from './entities/segment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Point, Segment])],
  controllers: [RoutesController, PointsController],
  providers: [RoutesService, PointsService],
})
export class RoutesModule {}
