import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
import { Participation } from './participation.entity';

export enum NotificationType {
    INFO = 'INFO',
    ALERT = 'ALERTE',
    END_TRIP = 'FIN_TRAJET',
    NEW_POINT = 'NOUVEAU_POINT',
    NAV_ERROR = 'ERREUR_NAVIGATION',
}

export enum NotificationPriority {
    LOW = 'BASSE',
    MEDIUM = 'MOYENNE',
    HIGH = 'HAUTE',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { nullable: true })
    user: User; // Null if anonymous

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => Participation, { nullable: true })
    participation: Participation; // Target anonymous participant

    @Column({ nullable: true })
    participationId: string;

    @ManyToOne(() => Event)
    event: Event;

    @Column()
    eventId: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column()
    title: string;

    @Column({ type: 'text' })
    message: string;

    @CreateDateColumn()
    sentAt: Date;

    @Column({ default: false })
    isRead: boolean;

    @Column({
        type: 'enum',
        enum: NotificationPriority,
        default: NotificationPriority.MEDIUM,
    })
    priority: NotificationPriority;
}
