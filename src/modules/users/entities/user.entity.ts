import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Participation } from '../../participation/entities/participation.entity';
import { Event } from '../../events/entities/event.entity';

export enum UserRole {
    ADMIN = 'ADMINISTRATEUR',
    PARTICIPANT = 'PARTICIPANT',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ select: false, nullable: true })
    password?: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    profilePhoto: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PARTICIPANT,
    })
    role: UserRole;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Event, (event) => event.organizer)
    organizedEvents: Event[];

    @OneToMany(() => Participation, (participation) => participation.user)
    participations: Participation[];
}
