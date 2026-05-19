import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class ProfileResponseDto {
  @ApiProperty({ description: 'User ID (admin) or Participation ID (participant)', example: 'uuid-v4' })
  sub: string;

  @ApiProperty({ required: false, description: 'Present for admin users only', example: 'admin@example.com' })
  email?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ required: false, description: 'Present for participant tokens only', example: 'uuid-v4' })
  eventId?: string;

  @ApiProperty({ required: false, example: false })
  isAnonymous?: boolean;
}
