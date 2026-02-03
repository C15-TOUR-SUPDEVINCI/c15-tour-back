import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { Point } from '../../routes/entities/point.entity';
import { RealTimePosition } from './real-time-position.entity';
import { CorrectionNavigation } from './correction.entity';

export enum ParticipationStatus {
  REGISTERED = 'INSCRIT',
  ONGOING = 'EN_COURS',
  COMPLETED = 'TERMINE',
  ABANDONED = 'ABANDONNE',
}

@Entity('participations')
export class Participation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.participations, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Event, (event) => event.participations)
  event: Event;

  @Column()
  eventId: string;

  @Column({ nullable: true })
  anonymousId: string; // For users without account

  @CreateDateColumn()
  registrationDate: Date;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.REGISTERED,
  })
  status: ParticipationStatus;

  @Column({ type: 'float', nullable: true })
  currentLat: number;

  @Column({ type: 'float', nullable: true })
  currentLon: number;

  @Column({ type: 'timestamp', nullable: true })
  lastPositionUpdate: Date;

  @ManyToOne(() => Point, { nullable: true })
  currentPoint: Point;

  @Column({ nullable: true })
  currentPointId: string;

  @Column({ type: 'float', default: 0 })
  progressPercentage: number;

  @Column({ default: false })
  hasFinished: boolean;

  @OneToMany(() => RealTimePosition, (pos) => pos.participation)
  positions: RealTimePosition[];

  @OneToMany(() => CorrectionNavigation, (corr) => corr.participation)
  corrections: CorrectionNavigation[];
}
