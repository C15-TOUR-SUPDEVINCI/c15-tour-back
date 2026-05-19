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
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ChangeEventStatusDto } from './dto/change-event-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventResponseDto } from './dto/event-response.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new event (auto-generates shareCode)' })
  @ApiCreatedResponse({ type: EventResponseDto })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiOkResponse({ type: EventResponseDto, isArray: true })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiOkResponse({ type: EventResponseDto })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update event details' })
  @ApiOkResponse({ type: EventResponseDto })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change event status (DRAFT→PLANNED→ONGOING→COMPLETED/CANCELLED)',
  })
  @ApiOkResponse({ type: EventResponseDto })
  changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeEventStatusDto,
  ) {
    return this.eventsService.changeStatus(id, changeStatusDto.status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete event by ID' })
  @ApiOkResponse({ description: 'Event deleted successfully' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
