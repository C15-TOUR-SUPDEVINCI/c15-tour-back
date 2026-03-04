import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

const SHARE_CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SHARE_CODE_LENGTH = 8;

// Allowed status transitions
const STATUS_TRANSITIONS: Record<EventStatus, EventStatus[]> = {
  [EventStatus.DRAFT]: [EventStatus.PLANNED, EventStatus.CANCELLED],
  [EventStatus.PLANNED]: [EventStatus.ONGOING, EventStatus.CANCELLED],
  [EventStatus.ONGOING]: [EventStatus.COMPLETED, EventStatus.CANCELLED],
  [EventStatus.COMPLETED]: [],
  [EventStatus.CANCELLED]: [],
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  // ─── Share Code ───────────────────────────────────────────────
  private generateCode(): string {
    let code = '';
    for (let i = 0; i < SHARE_CODE_LENGTH; i++) {
      code += SHARE_CODE_CHARS.charAt(
        Math.floor(Math.random() * SHARE_CODE_CHARS.length),
      );
    }
    return code;
  }

  private async generateUniqueShareCode(): Promise<string> {
    let code: string;
    let exists: Event | null;
    let attempts = 0;

    do {
      if (attempts > 10) {
        throw new Error('Could not generate a unique share code');
      }
      code = this.generateCode();
      exists = await this.eventsRepository.findOneBy({ shareCode: code });
      attempts++;
    } while (exists);

    return code;
  }

  // ─── CRUD ─────────────────────────────────────────────────────
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const shareCode = await this.generateUniqueShareCode();
    const event = this.eventsRepository.create({
      ...createEventDto,
      shareCode,
      status: EventStatus.DRAFT,
    });
    return this.eventsRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['organizer', 'route'],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['organizer', 'route', 'participations'],
    });
    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventsRepository.save(event);
  }

  async changeStatus(id: string, newStatus: EventStatus): Promise<Event> {
    const event = await this.findOne(id);
    const allowed = STATUS_TRANSITIONS[event.status];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from "${event.status}" to "${newStatus}". Allowed: [${allowed.join(', ') || 'none'}]`,
      );
    }

    event.status = newStatus;
    return this.eventsRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }

  async incrementParticipantCount(eventId: string): Promise<void> {
    await this.eventsRepository.increment(
      { id: eventId },
      'currentParticipantsCount',
      1,
    );
  }

  async findByShareCode(code: string): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { shareCode: code },
      relations: ['route'],
    });
  }
}
