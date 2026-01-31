import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Participation } from './participation.entity';
import { Point } from '../../routes/entities/point.entity';

@Entity('correction_navigations')
export class CorrectionNavigation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Participation, (participation) => participation.corrections)
    participation: Participation;

    @Column()
    participationId: string;

    @Column({ type: 'float' })
    errorLat: number;

    @Column({ type: 'float' })
    errorLon: number;

    @ManyToOne(() => Point, { nullable: true })
    targetPoint: Point;

    @Column({ nullable: true })
    targetPointId: string;

    @Column({ type: 'float', nullable: true })
    deviationDistanceMeters: number;

    @Column({ type: 'json', nullable: true })
    correctionRoute: { lat: number; lon: number }[];

    @CreateDateColumn()
    detectedAt: Date;

    @Column({ default: false })
    isAccepted: boolean;
}
