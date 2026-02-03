import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Point } from './point.entity';
import { Segment } from './segment.entity';

export enum RouteType {
  NATIONAL = 'NATIONALE',
  DEPARTMENTAL = 'DEPARTEMENTALE',
  HIGHWAY = 'AUTOROUTE',
  MIXED = 'MIXTE',
}

export enum DifficultyLevel {
  EASY = 'FACILE',
  MEDIUM = 'MOYEN',
  HARD = 'DIFFICILE',
}

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Event, (event) => event.route)
  @JoinColumn()
  event: Event;

  @Column({ nullable: true })
  eventId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  totalDistanceKm: number;

  @Column({ type: 'int', nullable: true })
  estimatedDurationMinutes: number;

  @Column({
    type: 'enum',
    enum: RouteType,
    default: RouteType.MIXED,
  })
  routeType: RouteType;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficultyLevel: DifficultyLevel;

  @OneToMany(() => Point, (point) => point.route)
  points: Point[];

  @OneToMany(() => Segment, (segment) => segment.route)
  segments: Segment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
