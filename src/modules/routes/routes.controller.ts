import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { Route } from './entities/route.entity';

@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Post()
    create(@Body() route: Partial<Route>) {
        return this.routesService.create(route);
    }

    @Get()
    findAll() {
        return this.routesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.routesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() route: Partial<Route>) {
        return this.routesService.update(id, route);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.routesService.remove(id);
    }
}
