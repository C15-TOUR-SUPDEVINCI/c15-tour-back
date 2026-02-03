import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { Participation } from './entities/participation.entity';

@Controller('participation')
export class ParticipationController {
    constructor(private readonly participationService: ParticipationService) { }

    @Post()
    create(@Body() participation: Partial<Participation>) {
        return this.participationService.create(participation);
    }

    @Get()
    findAll() {
        return this.participationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.participationService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() participation: Partial<Participation>) {
        return this.participationService.update(id, participation);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.participationService.remove(id);
    }
}
