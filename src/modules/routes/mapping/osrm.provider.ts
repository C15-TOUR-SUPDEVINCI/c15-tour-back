import axios from 'axios';
import {
  IMappingProvider,
  SegmentCalculationResult,
} from './mapping.interface';
import { Point } from '../entities/point.entity';

interface OsrmRoute {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
}
interface OsrmResponse {
  routes: OsrmRoute[];
}

export class OsrmProvider implements IMappingProvider {
  private readonly baseUrl = 'http://router.project-osrm.org/route/v1/driving';

  async calculateSegment(
    from: Point,
    to: Point,
  ): Promise<SegmentCalculationResult> {
    const url = `${this.baseUrl}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;

    const response = await axios.get<OsrmResponse>(url, {
      params: { overview: 'full', geometries: 'geojson', steps: false },
      timeout: 10000,
    });

    const route = response.data?.routes?.[0];
    if (!route) {
      throw new Error(
        `OSRM returned no route between points "${from.name}" and "${to.name}"`,
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
