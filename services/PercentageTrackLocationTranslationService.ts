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
    let closestPercentage = 0;

    for (let i = 0; i < this.trackSpline.length; i++) {
      const point1 = this.trackSpline[i];
      const point2 = this.trackSpline[(i + 1) % this.trackSpline.length];

      const A = location.x - point1.x;
      const B = location.y - point1.y;
      const C = point2.x - point1.x;
      const D = point2.y - point1.y;

      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      const param = len_sq !== 0 ? dot / len_sq : -1;

      let xx, yy;

      if (param < 0) {
        xx = point1.x;
        yy = point1.y;
      } else if (param > 1) {
        xx = point2.x;
        yy = point2.y;
      } else {
        xx = point1.x + param * C;
        yy = point1.y + param * D;
      }

      const distance = this.getDistance(
        { x: xx, y: yy },
        { x: location.x, y: location.y }
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPercentage = (i + param) / this.trackSpline.length;
      }
    }

    return Math.max(
      0,
      Math.min(parseFloat((closestPercentage * 100).toFixed(4)), 100)
    );
  };
}
