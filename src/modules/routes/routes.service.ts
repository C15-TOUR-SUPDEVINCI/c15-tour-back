import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { Segment } from './entities/segment.entity';
import { Point } from './entities/point.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { MappingService } from './mapping/mapping.service';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private routesRepository: Repository<Route>,
    @InjectRepository(Segment)
    private segmentsRepository: Repository<Segment>,
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
    private readonly mappingService: MappingService,
  ) {}

  create(createRouteDto: CreateRouteDto): Promise<Route> {
    const route = this.routesRepository.create(createRouteDto);
    return this.routesRepository.save(route);
  }

  findAll(): Promise<Route[]> {
    return this.routesRepository.find({ relations: ['points', 'segments'] });
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routesRepository.findOne({
      where: { id },
      relations: ['points', 'segments'],
    });
    if (!route) {
      throw new NotFoundException(`Route with ID "${id}" not found`);
    }
    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDto);
    return this.routesRepository.save(route);
  }

  async remove(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routesRepository.remove(route);
  }

  /**
   * Calculate all segments for a route by calling the configured mapping provider.
   * - Fetches all points ordered by `order`
   * - For each consecutive pair (N, N+1), calls the mapping API to get distance, duration, polyline
   * - Creates/replaces all Segment records
   * - Updates Route with total distance and duration
   */
  async calculateRoute(id: string): Promise<Route> {
    const route = await this.findOne(id);

    // Get all points ordered by their sequence
    const points = await this.pointsRepository.find({
      where: { routeId: id },
      order: { order: 'ASC' },
    });

    if (points.length < 2) {
      throw new NotFoundException(
        `Route "${id}" needs at least 2 points to calculate segments (found ${points.length})`,
      );
    }

    // Delete existing segments to recalculate fresh
    await this.segmentsRepository.delete({ routeId: id });

    let totalDistanceKm = 0;
    let totalDurationMinutes = 0;
    const segments: Segment[] = [];

    // Calculate segment between each consecutive pair of points
    for (let i = 0; i < points.length - 1; i++) {
      const from: Point = points[i];
      const to: Point = points[i + 1];

      const result = await this.mappingService.calculateSegment(from, to);

      const segment = this.segmentsRepository.create({
        routeId: id,
        startPointId: from.id,
        endPointId: to.id,
        order: i + 1,
        distanceKm: result.distanceKm,
        estimatedDurationMinutes: result.estimatedDurationMinutes,
        gpsCoordinates: result.gpsCoordinates,
        roadType: result.roadType,
      });

      segments.push(await this.segmentsRepository.save(segment));

      totalDistanceKm += result.distanceKm;
      totalDurationMinutes += result.estimatedDurationMinutes;

      // Add pause duration if the start point is a PAUSE type
      if (from.pauseDurationMinutes) {
        totalDurationMinutes += from.pauseDurationMinutes;
      }
    }

    // Update route with computed totals
    route.totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
    route.estimatedDurationMinutes = totalDurationMinutes;
    route.segments = segments;

    return this.routesRepository.save(route);
  }
}
