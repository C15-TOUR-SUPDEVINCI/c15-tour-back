import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IMappingProvider,
  SegmentCalculationResult,
} from './mapping.interface';
import { OsrmProvider } from './osrm.provider';
import { MapboxProvider } from './mapbox.provider';
import { GoogleMapsProvider } from './google-maps.provider';
import { Point } from '../entities/point.entity';

export type MappingProviderName = 'osrm' | 'mapbox' | 'google';

@Injectable()
export class MappingService {
  private readonly logger = new Logger(MappingService.name);
  private readonly provider: IMappingProvider;
  private readonly providerName: MappingProviderName;

  constructor(private readonly configService: ConfigService) {
    this.providerName = (
      this.configService.get<string>('MAPPING_PROVIDER') ?? 'osrm'
    ).toLowerCase() as MappingProviderName;

    this.provider = this.createProvider(this.providerName);
    this.logger.log(`Mapping provider: ${this.providerName.toUpperCase()}`);
  }

  private createProvider(name: MappingProviderName): IMappingProvider {
    switch (name) {
      case 'mapbox': {
        const token = this.configService.get<string>('MAPBOX_TOKEN');
        if (!token) {
          throw new Error(
            'MAPBOX_TOKEN is required when MAPPING_PROVIDER=mapbox',
          );
        }
        return new MapboxProvider(token);
      }
      case 'google': {
        const key = this.configService.get<string>('GOOGLE_MAPS_KEY');
        if (!key) {
          throw new Error(
            'GOOGLE_MAPS_KEY is required when MAPPING_PROVIDER=google',
          );
        }
        return new GoogleMapsProvider(key);
      }
      case 'osrm':
      default:
        return new OsrmProvider();
    }
  }

  async calculateSegment(
    from: Point,
    to: Point,
  ): Promise<SegmentCalculationResult> {
    try {
      return await this.provider.calculateSegment(from, to);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `[${this.providerName.toUpperCase()}] Failed to calculate segment "${from.name} → ${to.name}": ${message}`,
      );
      throw new InternalServerErrorException(
        `Route calculation failed for segment "${from.name ?? 'Point'} → ${to.name ?? 'Point'}": ${message}`,
      );
    }
  }

  getProviderName(): string {
    return this.providerName;
  }
}
