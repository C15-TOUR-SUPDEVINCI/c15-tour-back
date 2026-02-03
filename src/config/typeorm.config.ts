import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Event } from '../modules/events/entities/event.entity';
import { AudioStream } from '../modules/events/entities/audio-stream.entity';
import { EventHistory } from '../modules/events/entities/event-history.entity';
import { Route } from '../modules/routes/entities/route.entity';
import { Point } from '../modules/routes/entities/point.entity';
import { Segment } from '../modules/routes/entities/segment.entity';
import { Participation } from '../modules/participation/entities/participation.entity';
import { RealTimePosition } from '../modules/participation/entities/real-time-position.entity';
import { CorrectionNavigation } from '../modules/participation/entities/correction.entity';
import { Notification } from '../modules/participation/entities/notification.entity';
@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 3306),
      username: this.configService.get('DB_USERNAME', 'root'),
      password: this.configService.get('DB_PASSWORD', ''),
      database: this.configService.get('DB_DATABASE', 'C15'),
      entities: [
        User,
        Event,
        AudioStream,
        EventHistory,
        Route,
        Point,
        Segment,
        Participation,
        RealTimePosition,
        CorrectionNavigation,
        Notification,
      ],
      synchronize: this.configService.get('DB_SYNCHRONIZE') === 'true',
      logging: this.configService.get('DB_LOGGING', false),
    };
  }
}
