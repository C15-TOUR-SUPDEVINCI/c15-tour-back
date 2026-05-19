/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ParticipationService } from '../participation/participation.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private participationService: ParticipationService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result as User;
      }
    }
    return null;
  }

  async loginAdmin(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: UserRole.ADMIN,
      isAnonymous: false,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d') as any,
      }),
      user,
    };
  }

  async registerAdmin(createUserDto: CreateUserDto) {
    // Force role to ADMIN for this endpoint if needed, or rely on DTO
    // Usually admin registration is protected or special.
    // For simplicity, we just leverage usersService.create
    const user = await this.usersService.create({
      ...createUserDto,
      role: UserRole.ADMIN,
    });
    return this.loginAdmin(user);
  }

  async participantLogin(code: string, anonymousId?: string) {
    // 1. Join event via Participation Service
    // This assumes participationService handles code validation and participation creation/retrieval
    const participation = await this.participationService.joinEvent(
      code,
      anonymousId,
    );

    // 2. Generate Token
    const payload: JwtPayload = {
      sub: participation.id,
      role: UserRole.PARTICIPANT,
      eventId: participation.eventId,
      isAnonymous: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d') as any,
      }),
      participation,
    };
  }

  refreshToken(payload: JwtPayload) {
    const newPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      eventId: payload.eventId,
      isAnonymous: payload.isAnonymous,
    };
    return {
      access_token: this.jwtService.sign(newPayload),
    };
  }
}
