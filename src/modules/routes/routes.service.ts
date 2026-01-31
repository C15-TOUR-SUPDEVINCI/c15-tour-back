import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route)
        private routesRepository: Repository<Route>,
    ) { }

    create(route: Partial<Route>) {
        return this.routesRepository.save(route);
    }

    findAll() {
        return this.routesRepository.find({ relations: ['points', 'segments'] });
    }

    findOne(id: string) {
        return this.routesRepository.findOne({
            where: { id },
            relations: ['points', 'segments'],
        });
    }

    update(id: string, route: Partial<Route>) {
        return this.routesRepository.update(id, route);
    }

    remove(id: string) {
        return this.routesRepository.delete(id);
    }
}
