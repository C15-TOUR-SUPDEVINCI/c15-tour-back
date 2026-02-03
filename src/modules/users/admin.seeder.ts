import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  async seedAdmin() {
    const email = this.configService.get<string>('SUPERADMIN_EMAIL');
    const password = this.configService.get<string>('SUPERADMIN_PASSWORD');
    const firstName = this.configService.get<string>('SUPERADMIN_FIRSTNAME');
    const lastName = this.configService.get<string>('SUPERADMIN_LASTNAME');

    if (!email || !password) {
      this.logger.warn(
        'Super Admin credentials not found in .env. Skipping admin seeding.',
      );
      return;
    }

    const existingAdmin = await this.usersService.findByEmail(email);
    if (existingAdmin) {
      this.logger.log(`Super Admin (${email}) already exists.`);
      return;
    }

    this.logger.log(`Creating Super Admin (${email})...`);
    await this.usersService.create({
      email,
      password,
      firstName: firstName || 'Super',
      lastName: lastName || 'Admin',
      role: UserRole.ADMIN,
      isActive: true,
    });
    this.logger.log('Super Admin created successfully.');
  }
}
