import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationService } from './participation.service';
import { ParticipationController } from './participation.controller';
import { RealTimePositionService } from './real-time-position.service';
import { RealTimePositionController } from './real-time-position.controller';
import { Participation } from './entities/participation.entity';
import { RealTimePosition } from './entities/real-time-position.entity';
import { CorrectionNavigation } from './entities/correction.entity';
import { Notification } from './entities/notification.entity';

import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Participation,
      RealTimePosition,
      CorrectionNavigation,
      Notification,
    ]),
    EventsModule,
  ],
  controllers: [ParticipationController, RealTimePositionController],
  providers: [ParticipationService, RealTimePositionService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
