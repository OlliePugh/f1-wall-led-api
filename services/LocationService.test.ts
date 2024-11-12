import LocationService from "./LocationService";
import type { TrackLocation } from "./ILocationService";

describe("LocationService", () => {
  let sut: LocationService;
  beforeEach(() => {
    sut = new LocationService(10_000, 1234);
  });

  it("should remove locations that are in both initial locations and new locations", () => {
    const initialLocations: TrackLocation[] = [
      { x: 0, y: 0, z: 0, date: 1000, driverNumber: 1 },
      { x: 1, y: 2, z: 3, date: 1200, driverNumber: 2 },
      { x: 4, y: 4, z: 4, date: 1200, driverNumber: 3 },
      { x: 5, y: 5, z: 5, date: 1300, driverNumber: 4 },
    ];

    const newLocations = [
      { x: 4, y: 4, z: 4, date: 1200, driverNumber: 3 },
      { x: 5, y: 5, z: 5, date: 1300, driverNumber: 4 },
      { x: 1, y: 1, z: 1, date: 1301, driverNumber: 2 },
      { x: 5, y: 5, z: 5, date: 1350, driverNumber: 1 },
    ];

    const expectedLocations = [
      { x: 0, y: 0, z: 0, date: 1000, driverNumber: 1 },
      { x: 1, y: 2, z: 3, date: 1200, driverNumber: 2 },
      { x: 4, y: 4, z: 4, date: 1200, driverNumber: 3 },
      { x: 5, y: 5, z: 5, date: 1300, driverNumber: 4 },
      { x: 1, y: 1, z: 1, date: 1301, driverNumber: 2 },
      { x: 5, y: 5, z: 5, date: 1350, driverNumber: 1 },
    ];

    sut.locations = initialLocations;
    sut.updateLocations(newLocations);

    const result = sut.locations;
    expect(result).toEqual(expectedLocations);
  });

  it("should add all new locations if there is no intersection in the data", () => {
    const initialLocations: TrackLocation[] = [
      { x: 0, y: 0, z: 0, date: 1000, driverNumber: 1 },
      { x: 1, y: 2, z: 3, date: 1200, driverNumber: 2 },
    ];

    const newLocations = [
      { x: 4, y: 4, z: 4, date: 1300, driverNumber: 3 },
      { x: 5, y: 5, z: 5, date: 1400, driverNumber: 4 },
    ];

    const expectedLocations = [
      { x: 0, y: 0, z: 0, date: 1000, driverNumber: 1 },
      { x: 1, y: 2, z: 3, date: 1200, driverNumber: 2 },
      { x: 4, y: 4, z: 4, date: 1300, driverNumber: 3 },
      { x: 5, y: 5, z: 5, date: 1400, driverNumber: 4 },
    ];

    sut.locations = initialLocations;
    sut.updateLocations(newLocations);

    const result = sut.locations;
    expect(result).toEqual(expectedLocations);
  });
});
