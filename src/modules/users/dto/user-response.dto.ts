import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ nullable: true, example: 'Jean' })
  firstName: string;

  @ApiProperty({ nullable: true, example: 'Dupont' })
  lastName: string;

  @ApiProperty({ nullable: true, example: 'jean.dupont@example.com' })
  email: string;

  @ApiProperty({ nullable: true, example: '+33612345678' })
  phone: string;

  @ApiProperty({ nullable: true, example: 'uploads/photo.jpg' })
  profilePhoto: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ nullable: true, example: '2025-01-01T10:00:00.000Z' })
  lastLogin: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
