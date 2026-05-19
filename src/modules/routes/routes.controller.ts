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
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RouteResponseDto } from './dto/route-response.dto';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a route for an event' })
  @ApiCreatedResponse({ type: RouteResponseDto })
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiOkResponse({ type: RouteResponseDto, isArray: true })
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID (includes points and segments)' })
  @ApiOkResponse({ type: RouteResponseDto })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update route' })
  @ApiOkResponse({ type: RouteResponseDto })
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Post(':id/calculate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Calculate all segments for a route via the configured mapping provider (OSRM / Mapbox / Google Maps)',
  })
  @ApiCreatedResponse({ type: RouteResponseDto, description: 'Route with calculated segments populated' })
  calculateRoute(@Param('id') id: string) {
    return this.routesService.calculateRoute(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete route' })
  @ApiOkResponse({ description: 'Route deleted successfully' })
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}
