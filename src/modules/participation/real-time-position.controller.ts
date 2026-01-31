import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RealTimePositionService } from './real-time-position.service';
import { RealTimePosition } from './entities/real-time-position.entity';

@Controller('positions')
export class RealTimePositionController {
    constructor(private readonly positionsService: RealTimePositionService) { }

    @Post()
    create(@Body() position: Partial<RealTimePosition>) {
        return this.positionsService.create(position);
    }

    @Get()
    findAll(@Query('participationId') participationId?: string) {
        if (participationId) {
            return this.positionsService.findByParticipation(participationId);
        }
        return this.positionsService.findAll();
    }
}
