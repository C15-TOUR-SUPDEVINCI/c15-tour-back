import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string; // userId or participationId
  email?: string; // for admins
  role: UserRole; // ADMIN or PARTICIPANT
  eventId?: string; // for participants
  isAnonymous?: boolean; // to distinguish
}
