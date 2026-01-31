import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from './entities/participation.entity';

@Injectable()
export class ParticipationService {
    constructor(
        @InjectRepository(Participation)
        private participationRepository: Repository<Participation>,
    ) { }

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
