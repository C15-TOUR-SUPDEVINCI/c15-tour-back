import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Participation } from './participation.entity';

@Entity('real_time_positions')
export class RealTimePosition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Participation, (participation) => participation.positions)
    participation: Participation;

    @Column()
    participationId: string;

    @Column({ type: 'float' })
    latitude: number;

    @Column({ type: 'float' })
    longitude: number;

    @Column({ type: 'float', nullable: true })
    speed: number;

    @Column({ type: 'float', nullable: true })
    heading: number;

    @Column({ type: 'float', nullable: true })
    altitude: number;

    @Column({ type: 'float', nullable: true })
    accuracy: number;

    @CreateDateColumn()
    timestamp: Date;
}
