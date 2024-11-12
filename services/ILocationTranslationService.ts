import type { TrackLocation } from "./ILocationService";

export default interface ILocationTranslationService {
  translateLocation(location: TrackLocation): number;
}
