import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { LoginParticipantDto } from './dto/login-participant.dto';
import { AdminLoginResponseDto } from './dto/admin-login-response.dto';
import { ParticipantLoginResponseDto } from '../participation/dto/participant-login-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  @ApiCreatedResponse({ type: AdminLoginResponseDto })
  async login(@Request() req) {
    return this.authService.loginAdmin(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      req.user,
    );
  }

  @Post('participant/join')
  @ApiOperation({ summary: 'Participant joins an event via code' })
  @ApiCreatedResponse({ type: ParticipantLoginResponseDto })
  async join(@Body() loginDto: LoginParticipantDto) {
    return this.authService.participantLogin(
      loginDto.code,
      loginDto.anonymousId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
