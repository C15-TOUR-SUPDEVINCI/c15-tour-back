import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('event_histories')
export class EventHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Event, (event) => event.history)
    @JoinColumn()
    event: Event;

    @Column({ nullable: true })
    dateEvent: Date;

    @Column({ type: 'int', nullable: true })
    realDurationMinutes: number;

    @Column({ type: 'float', nullable: true })
    realDistanceKm: number;

    @Column({ type: 'int', nullable: true })
    participantCount: number;

    @Column({ type: 'float', nullable: true })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;
}
