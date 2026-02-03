import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from './entities/point.entity';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
  ) {}

  create(point: Partial<Point>) {
    return this.pointsRepository.save(point);
  }

  findAll() {
    return this.pointsRepository.find();
  }

  findByRoute(routeId: string) {
    return this.pointsRepository.find({
      where: { routeId },
      order: { order: 'ASC' },
    });
  }

  findOne(id: string) {
    return this.pointsRepository.findOneBy({ id });
  }

  update(id: string, point: Partial<Point>) {
    return this.pointsRepository.update(id, point);
  }

  remove(id: string) {
    return this.pointsRepository.delete(id);
  }
}
