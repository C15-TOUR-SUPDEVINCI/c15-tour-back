import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point, PointType } from './entities/point.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Point)
    private pointsRepository: Repository<Point>,
  ) {}

  create(createPointDto: CreatePointDto): Promise<Point> {
    if (
      createPointDto.type === PointType.PAUSE &&
      !createPointDto.pauseDurationMinutes
    ) {
      throw new BadRequestException(
        'pauseDurationMinutes is required for PAUSE type points',
      );
    }
    const point = this.pointsRepository.create(createPointDto);
    return this.pointsRepository.save(point);
  }

  findAll(): Promise<Point[]> {
    return this.pointsRepository.find({ order: { order: 'ASC' } });
  }

  findByRoute(routeId: string): Promise<Point[]> {
    return this.pointsRepository.find({
      where: { routeId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Point> {
    const point = await this.pointsRepository.findOneBy({ id });
    if (!point) {
      throw new NotFoundException(`Point with ID "${id}" not found`);
    }
    return point;
  }

  async update(id: string, updatePointDto: UpdatePointDto): Promise<Point> {
    const point = await this.findOne(id);
    Object.assign(point, updatePointDto);
    return this.pointsRepository.save(point);
  }

  async remove(id: string): Promise<void> {
    const point = await this.findOne(id);
    await this.pointsRepository.remove(point);
  }
}
