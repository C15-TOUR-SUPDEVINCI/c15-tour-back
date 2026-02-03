import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { RoutesModule } from './modules/routes/routes.module';
import { ParticipationModule } from './modules/participation/participation.module';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),

    // Application modules
    AuthModule,
    UsersModule,
    EventsModule,
    RoutesModule,
    ParticipationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
