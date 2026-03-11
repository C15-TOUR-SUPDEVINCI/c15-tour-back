import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Participation,
  ParticipationStatus,
} from './entities/participation.entity';
import { EventsService } from '../events/events.service';
import { EventStatus } from '../events/entities/event.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,
    private eventsService: EventsService,
  ) {}

  async joinEvent(code: string, anonymousId?: string): Promise<Participation> {
    // 1. Validate event by share code
    const event = await this.eventsService.findByShareCode(code);
    if (!event) {
      throw new NotFoundException('Event not found or invalid code');
    }

    // 2. Check event is active (ONGOING or PLANNED)
    if (
      event.status !== EventStatus.ONGOING &&
      event.status !== EventStatus.PLANNED
    ) {
      throw new BadRequestException(
        `Event is not available to join (status: ${event.status})`,
      );
    }

    // 3. Check capacity
    if (event.currentParticipantsCount >= event.maxParticipants) {
      throw new ConflictException(
        'This event has reached its maximum capacity',
      );
    }

    // 4. Resolve anonymousId
    const realAnonymousId = anonymousId || uuidv4();

    // 5. Idempotency — return existing participation if same device
    const existing = await this.participationRepository.findOne({
      where: { eventId: event.id, anonymousId: realAnonymousId },
    });
    if (existing) {
      return existing;
    }

    // 6. Create participation
    const participation = this.participationRepository.create({
      event,
      eventId: event.id,
      anonymousId: realAnonymousId,
      status: ParticipationStatus.REGISTERED,
    });
    const saved = await this.participationRepository.save(participation);

    // 7. Increment participant count
    await this.eventsService.incrementParticipantCount(event.id);

    return saved;
  }

  create(participation: Partial<Participation>): Promise<Participation> {
    return this.participationRepository.save(participation);
  }

  findAll(): Promise<Participation[]> {
    return this.participationRepository.find({ relations: ['user', 'event'] });
  }

  async findOne(id: string): Promise<Participation> {
    const participation = await this.participationRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'positions', 'corrections'],
    });
    if (!participation) {
      throw new NotFoundException(`Participation with ID "${id}" not found`);
    }
    return participation;
  }

  async update(
    id: string,
    participation: Partial<Participation>,
  ): Promise<Participation> {
    const existing = await this.findOne(id);
    Object.assign(existing, participation);
    return this.participationRepository.save(existing);
  }

  async remove(id: string): Promise<void> {
    const participation = await this.findOne(id);
    await this.participationRepository.remove(participation);
  }
}
