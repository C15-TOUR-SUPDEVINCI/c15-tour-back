/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayload) {
    // If Admin/Registered User
    if (
      payload.role === UserRole.ADMIN ||
      (payload.email && !payload.isAnonymous)
    ) {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is disabled');
      }

      return { ...user, role: payload.role };
    }

    // If Anonymous Participant
    if (payload.role === UserRole.PARTICIPANT && payload.isAnonymous) {
      return {
        id: payload.sub,
        eventId: payload.eventId,
        role: UserRole.PARTICIPANT,
        isAnonymous: true,
      };
    }

    throw new UnauthorizedException('Invalid token');
  }
}
