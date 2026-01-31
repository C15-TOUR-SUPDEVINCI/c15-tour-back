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

@Module({
    imports: [TypeOrmModule.forFeature([Participation, RealTimePosition, CorrectionNavigation, Notification])],
    controllers: [ParticipationController, RealTimePositionController],
    providers: [ParticipationService, RealTimePositionService],
})
export class ParticipationModule { }
