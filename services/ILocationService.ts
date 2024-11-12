export type TrackLocation = {
  date: number;
  driverNumber: number;
  x: number;
  y: number;
  z: number;
};

export default interface ILocationService {
  locations: TrackLocation[];
}
