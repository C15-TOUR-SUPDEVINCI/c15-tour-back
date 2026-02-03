import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealTimePosition } from './entities/real-time-position.entity';

@Injectable()
export class RealTimePositionService {
  constructor(
    @InjectRepository(RealTimePosition)
    private positionsRepository: Repository<RealTimePosition>,
  ) {}

  create(position: Partial<RealTimePosition>) {
    return this.positionsRepository.save(position);
  }

  findAll() {
    return this.positionsRepository.find();
  }

  findByParticipation(participationId: string) {
    return this.positionsRepository.find({
      where: { participationId },
      order: { timestamp: 'DESC' },
    });
  }
}
