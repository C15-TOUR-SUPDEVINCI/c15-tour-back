import axios from 'axios';
import {
  IMappingProvider,
  SegmentCalculationResult,
} from './mapping.interface';
import { Point } from '../entities/point.entity';

interface MapboxLeg {
  distance: number;
  duration: number;
}
interface MapboxRoute {
  distance: number;
  duration: number;
  legs: MapboxLeg[];
  geometry: { coordinates: [number, number][] };
}
interface MapboxResponse {
  routes: MapboxRoute[];
}

export class MapboxProvider implements IMappingProvider {
  constructor(private readonly token: string) {}

  async calculateSegment(
    from: Point,
    to: Point,
  ): Promise<SegmentCalculationResult> {
    const coords = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}`;

    const response = await axios.get<MapboxResponse>(url, {
      params: {
        geometries: 'geojson',
        overview: 'full',
        access_token: this.token,
      },
      timeout: 10000,
    });

    const route = response.data?.routes?.[0];
    if (!route) {
      throw new Error(
        `Mapbox returned no route between points "${from.name}" and "${to.name}"`,
      );
    }

    const distanceKm = route.distance / 1000;
    const estimatedDurationMinutes = Math.round(route.duration / 60);
    const gpsCoordinates = (route.geometry?.coordinates ?? []).map(
      ([lon, lat]: [number, number]) => ({ lat, lon }),
    );

    return {
      distanceKm,
      estimatedDurationMinutes,
      gpsCoordinates,
      roadType: 'MIXTE',
    };
  }
}
