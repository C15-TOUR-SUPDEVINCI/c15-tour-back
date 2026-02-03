import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from './entities/participation.entity';
import { EventsService } from '../events/events.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,
    private eventsService: EventsService,
  ) {}

  async joinEvent(code: string, anonymousId?: string): Promise<Participation> {
    // 1. Validate Event Code
    const event = await this.eventsService.findByShareCode(code);
    if (!event) {
      throw new NotFoundException('Event not found or invalid code');
    }

    // 2. Check if anonymousId is provided, else generate one
    const realAnonymousId = anonymousId || uuidv4();

    // 3. Check if already participating (idempotency)
    const existing = await this.participationRepository.findOne({
      where: {
        eventId: event.id,
        anonymousId: realAnonymousId,
      },
    });

    if (existing) {
      return existing;
    }

    // 4. Create Participation
    const participation = this.participationRepository.create({
      event,
      anonymousId: realAnonymousId,
      // status default is REGISTERED
    });

    return this.participationRepository.save(participation);
  }

  create(participation: Partial<Participation>) {
    return this.participationRepository.save(participation);
  }

  findAll() {
    return this.participationRepository.find({ relations: ['user', 'event'] });
  }

  findOne(id: string) {
    return this.participationRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'positions', 'corrections'],
    });
  }

  update(id: string, participation: Partial<Participation>) {
    return this.participationRepository.update(id, participation);
  }

  remove(id: string) {
    return this.participationRepository.delete(id);
  }
}
