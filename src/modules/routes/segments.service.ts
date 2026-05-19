import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from './entities/segment.entity';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { SegmentProgressResponseDto } from './dto/segment-progress-response.dto';

const ON_SEGMENT_THRESHOLD_METERS = 50;

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private segmentRepository: Repository<Segment>,
  ) {}

  // creerSegment()
  create(dto: CreateSegmentDto): Promise<Segment> {
    const segment = this.segmentRepository.create(dto);
    return this.segmentRepository.save(segment);
  }

  findAll(): Promise<Segment[]> {
    return this.segmentRepository.find({
      relations: ['startPoint', 'endPoint'],
    });
  }

  findByRoute(routeId: string): Promise<Segment[]> {
    return this.segmentRepository.find({
      where: { routeId },
      relations: ['startPoint', 'endPoint'],
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Segment> {
    const segment = await this.segmentRepository.findOne({
      where: { id },
      relations: ['startPoint', 'endPoint'],
    });
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    return segment;
  }

  async update(id: string, dto: UpdateSegmentDto): Promise<Segment> {
    const segment = await this.findOne(id);
    Object.assign(segment, dto);
    return this.segmentRepository.save(segment);
  }

  async remove(id: string): Promise<void> {
    const segment = await this.findOne(id);
    await this.segmentRepository.remove(segment);
  }

  // obtenirPolyline() — returns the GPS coordinate array for the segment
  async getPolyline(id: string): Promise<{ lat: number; lon: number }[]> {
    const segment = await this.findOne(id);
    return segment.gpsCoordinates ?? [];
  }

  // calculerDistance() — Haversine formula between two points, returns km
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // calculerDuree() — estimated minutes for a given distance at average speed
  calculateDuration(distanceKm: number, averageSpeedKmh = 50): number {
    return Math.round((distanceKm / averageSpeedKmh) * 60);
  }

  // verifierProgression(position) — checks whether a GPS position is on this
  // segment and how far along it the participant is
  async checkProgress(
    id: string,
    latitude: number,
    longitude: number,
  ): Promise<SegmentProgressResponseDto> {
    const segment = await this.findOne(id);
    const polyline = segment.gpsCoordinates ?? [];

    if (polyline.length === 0) {
      return {
        isOnSegment: false,
        distanceFromSegmentMeters: Infinity,
        progressPercentage: 0,
      };
    }

    // Total polyline length in meters
    let totalMeters = 0;
    const cumulativeMeters: number[] = [0];
    for (let i = 1; i < polyline.length; i++) {
      const d =
        this.calculateDistance(
          polyline[i - 1].lat,
          polyline[i - 1].lon,
          polyline[i].lat,
          polyline[i].lon,
        ) * 1000;
      totalMeters += d;
      cumulativeMeters.push(totalMeters);
    }

    // Find the closest polyline vertex to the participant's position
    let minDistanceMeters = Infinity;
    let closestIndex = 0;
    for (let i = 0; i < polyline.length; i++) {
      const d =
        this.calculateDistance(latitude, longitude, polyline[i].lat, polyline[i].lon) *
        1000;
      if (d < minDistanceMeters) {
        minDistanceMeters = d;
        closestIndex = i;
      }
    }

    const progressPercentage =
      totalMeters > 0
        ? Math.min(100, (cumulativeMeters[closestIndex] / totalMeters) * 100)
        : 0;

    return {
      isOnSegment: minDistanceMeters <= ON_SEGMENT_THRESHOLD_METERS,
      distanceFromSegmentMeters: Math.round(minDistanceMeters),
      progressPercentage: Math.round(progressPercentage * 10) / 10,
    };
  }
}
