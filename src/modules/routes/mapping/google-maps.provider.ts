import axios from 'axios';
import {
  IMappingProvider,
  SegmentCalculationResult,
} from './mapping.interface';
import { Point } from '../entities/point.entity';

interface GoogleDistance {
  value: number;
  text: string;
}
interface GoogleDuration {
  value: number;
  text: string;
}
interface GoogleLeg {
  distance: GoogleDistance;
  duration: GoogleDuration;
}
interface GoogleRoute {
  legs: GoogleLeg[];
  overview_polyline: { points: string };
}
interface GoogleDirectionsResponse {
  routes: GoogleRoute[];
}

export class GoogleMapsProvider implements IMappingProvider {
  constructor(private readonly apiKey: string) {}

  async calculateSegment(
    from: Point,
    to: Point,
  ): Promise<SegmentCalculationResult> {
    const response = await axios.get<GoogleDirectionsResponse>(
      'https://maps.googleapis.com/maps/api/directions/json',
      {
        params: {
          origin: `${from.latitude},${from.longitude}`,
          destination: `${to.latitude},${to.longitude}`,
          key: this.apiKey,
        },
        timeout: 10000,
      },
    );

    const route = response.data?.routes?.[0];
    if (!route) {
      throw new Error(
        `Google Maps returned no route between points "${from.name}" and "${to.name}"`,
      );
    }

    const leg = route.legs[0];
    const distanceKm = leg.distance.value / 1000;
    const estimatedDurationMinutes = Math.round(leg.duration.value / 60);
    const gpsCoordinates = this.decodePolyline(
      route.overview_polyline?.points ?? '',
    );

    return {
      distanceKm,
      estimatedDurationMinutes,
      gpsCoordinates,
      roadType: 'MIXTE',
    };
  }

  private decodePolyline(encoded: string): { lat: number; lon: number }[] {
    const points: { lat: number; lon: number }[] = [];
    let index = 0,
      lat = 0,
      lng = 0;
    while (index < encoded.length) {
      let shift = 0,
        result = 0,
        byte: number;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lat += result & 1 ? ~(result >> 1) : result >> 1;
      shift = 0;
      result = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      lng += result & 1 ? ~(result >> 1) : result >> 1;
      points.push({ lat: lat / 1e5, lon: lng / 1e5 });
    }
    return points;
  }
}
