import type { Coordinate } from "./Coordinate";
import type ILocationTranslationService from "./ILocationTranslationService";
import type { TrackLocation } from "./ILocationService";

export default class PercentageTrackLocationTranslationService
  implements ILocationTranslationService
{
  constructor(private readonly trackSpline: Coordinate[]) {}

  private getDistance(point1: Coordinate, point2: Coordinate): number {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  }

  translateLocation = (location: TrackLocation): number => {
    let closestDistance = Infinity;
    let closestIndex = 0;
    let totalDistance = 0;
    let distanceToClosestPoint = 0;

    for (let i = 0; i < this.trackSpline.length; i++) {
      const point1 = this.trackSpline[i];
      const point2 = this.trackSpline[(i + 1) % this.trackSpline.length]; // Wrap around to the first point
      const segmentDistance = this.getDistance(point1, point2);
      totalDistance += segmentDistance;

      const t =
        ((location.x - point1.x) * (point2.x - point1.x) +
          (location.y - point1.y) * (point2.y - point1.y)) /
        Math.pow(segmentDistance, 2);
      const tClamped = Math.max(0, Math.min(1, t));
      const closestPoint = {
        x: point1.x + tClamped * (point2.x - point1.x),
        y: point1.y + tClamped * (point2.y - point1.y),
      };

      const distance = this.getDistance(location, closestPoint);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
        distanceToClosestPoint =
          totalDistance -
          segmentDistance +
          this.getDistance(point1, closestPoint);
      }
    }

    return parseFloat(
      ((distanceToClosestPoint / totalDistance) * 100).toFixed(2)
    );
  };
}
