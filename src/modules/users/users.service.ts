import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll() {
        return this.usersRepository.find();
    }

    findOne(id: string) {
        return this.usersRepository.findOneBy({ id });
    }

    create(user: Partial<User>) {
        return this.usersRepository.save(user);
    }

    update(id: string, user: Partial<User>) {
        return this.usersRepository.update(id, user);
    }

    remove(id: string) {
        return this.usersRepository.delete(id);
    }
}
