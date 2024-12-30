export type TrackLocation = {
  date: Date;
  driverNumber: number;
  x: number;
  y: number;
  z: number;
};

export default interface ILocationService {
  locations: TrackLocation[];
}
