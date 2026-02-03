import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'isActive',
        'firstName',
        'lastName',
      ], // Explicitly select password
    });
  }

  findOne(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  async create(userData: Partial<User>) {
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    return this.usersRepository.save(userData);
  }

  update(id: string, user: Partial<User>) {
    return this.usersRepository.update(id, user);
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
