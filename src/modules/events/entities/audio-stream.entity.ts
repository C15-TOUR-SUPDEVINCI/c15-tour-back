import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity('audio_streams')
export class AudioStream {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Event, (event) => event.audioStream)
    @JoinColumn()
    event: Event;

    @Column({ unique: true })
    url: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    startedAt: Date;

    @Column({ nullable: true })
    endedAt: Date;
}
