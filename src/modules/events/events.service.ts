import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    create(event: Partial<Event>) {
        // Logic for generating shareCode would go here
        return this.eventsRepository.save(event);
    }

    findAll() {
        return this.eventsRepository.find();
    }

    findOne(id: string) {
        return this.eventsRepository.findOneBy({ id });
    }

    update(id: string, event: Partial<Event>) {
        return this.eventsRepository.update(id, event);
    }

    remove(id: string) {
        return this.eventsRepository.delete(id);
    }
}
