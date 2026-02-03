import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { AudioStream } from './entities/audio-stream.entity';
import { EventHistory } from './entities/event-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, AudioStream, EventHistory])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
