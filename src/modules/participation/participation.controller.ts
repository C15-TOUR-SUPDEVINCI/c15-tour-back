import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ParticipationService } from './participation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { ParticipationResponseDto } from './dto/participation-response.dto';

@ApiTags('participation')
@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post('join')
  @ApiOperation({
    summary: 'Join an event via share code (anonymous or authenticated)',
  })
  @ApiCreatedResponse({ type: ParticipationResponseDto })
  join(@Body() dto: CreateParticipationDto) {
    return this.participationService.joinEvent(dto.code, dto.anonymousId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all participations (admin only)' })
  @ApiOkResponse({ type: ParticipationResponseDto, isArray: true })
  findAll() {
    return this.participationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get participation by ID' })
  @ApiOkResponse({ type: ParticipationResponseDto })
  findOne(@Param('id') id: string) {
    return this.participationService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update participation (status, progress, etc.)' })
  @ApiOkResponse({ type: ParticipationResponseDto })
  update(@Param('id') id: string, @Body() body: UpdateParticipationDto) {
    return this.participationService.update(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete participation (admin only)' })
  @ApiOkResponse({ description: 'Participation deleted successfully' })
  remove(@Param('id') id: string) {
    return this.participationService.remove(id);
  }
}
