import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Route } from '../../routes/entities/route.entity';
import { Participation } from '../../participation/entities/participation.entity';
import { AudioStream } from './audio-stream.entity';
import { EventHistory } from './event-history.entity';

export enum EventStatus {
    DRAFT = 'BROUILLON',
    PLANNED = 'PLANIFIE',
    ONGOING = 'EN_COURS',
    COMPLETED = 'TERMINE',
    CANCELLED = 'ANNULE',
}

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ unique: true, length: 8 })
    shareCode: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({ type: 'int', nullable: true })
    estimatedDurationMinutes: number;

    @Column({ type: 'float', nullable: true })
    totalDistanceKm: number;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.DRAFT,
    })
    status: EventStatus;

    @Column({ type: 'int', default: 100 })
    maxParticipants: number;

    @Column({ type: 'int', default: 0 })
    currentParticipantsCount: number;

    @Column({ nullable: true })
    audioStreamUrl: string;

    @Column({ default: false })
    isAudioStreamActive: boolean;

    @ManyToOne(() => User, (user) => user.organizedEvents)
    organizer: User;

    @Column()
    organizerId: string;

    @OneToOne(() => Route, (route) => route.event)
    route: Route;

    @OneToMany(() => Participation, (participation) => participation.event)
    participations: Participation[];

    @OneToOne(() => AudioStream, (audio) => audio.event)
    audioStream: AudioStream;

    @OneToOne(() => EventHistory, (history) => history.event)
    history: EventHistory;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
