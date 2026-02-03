import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Route } from './route.entity';
import { Point } from './point.entity';

@Entity('segments')
export class Segment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Route, (route) => route.segments)
    route: Route;

    @Column()
    routeId: string;

    @ManyToOne(() => Point)
    startPoint: Point;

    @Column()
    startPointId: string;

    @ManyToOne(() => Point)
    endPoint: Point;

    @Column()
    endPointId: string;

    @Column({ type: 'int' })
    order: number;

    @Column({ type: 'float' })
    distanceKm: number;

    @Column({ type: 'int' })
    estimatedDurationMinutes: number;

    @Column({ type: 'json', nullable: true })
    gpsCoordinates: { lat: number; lon: number }[]; // Polyline

    @Column({ nullable: true })
    roadType: string;
}
