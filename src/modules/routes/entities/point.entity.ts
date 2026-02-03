import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Route } from './route.entity';

export enum PointType {
  PASSAGE = 'PASSAGE',
  INTEREST = 'INTERET',
  PAUSE = 'PAUSE',
}

@Entity('points')
export class Point {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Route, (route) => route.points)
  route: Route;

  @Column()
  routeId: string;

  @Column({
    type: 'enum',
    enum: PointType,
    default: PointType.PASSAGE,
  })
  type: PointType;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true }) // In minutes, mandatory if PAUSE
  pauseDurationMinutes: number;

  @Column({ type: 'int', nullable: true })
  estimatedTimeFromPreviousMinutes: number;

  @Column({ type: 'float', nullable: true })
  distanceFromPreviousKm: number;

  @Column({ type: 'timestamp', nullable: true })
  estimatedArrival: Date;

  @Column({ default: false })
  isReached: boolean;
}
