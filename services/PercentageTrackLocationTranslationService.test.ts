import PercentageTrackLocationTranslationService from "./PercentageTrackLocationTranslationService";
import fs from "fs";
import path from "path";
import type { Coordinate } from "./Coordinate";
import type { TrackLocation } from "./ILocationService";

const vegasTrack: Coordinate[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/abu-dhabi-2024-track.json"),
    "utf-8"
  )
);

describe("PercentageTrackLocationTranslationService", () => {
  let service: PercentageTrackLocationTranslationService;

  beforeAll(() => {
    const trackSpline: Coordinate[] = vegasTrack;
    service = new PercentageTrackLocationTranslationService(trackSpline);
  });

  it("should return the correct percentage for a given location on the track", () => {
    const location: TrackLocation = {
      x: -2150,
      y: 675,
      z: 0,
      driverNumber: 1,
      date: 0,
    };
    const percentage = service.translateLocation(location);
    console.log(`Percentage for location (-2150, 675): ${percentage}`);
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
    expect(percentage).toBeCloseTo(0.5, 1);
  });

  it("should return the correct percentage for another given location on the track", () => {
    const location: TrackLocation = {
      x: -1025,
      y: 1925,
      z: 0,
      driverNumber: 1,
      date: 0,
    };
    const percentage = service.translateLocation(location);
    console.log(`Percentage for location (-1025, 1925): ${percentage}`);
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
    expect(percentage).toBeCloseTo(0.5, 1);
  });

  it("should return the correct percentage for another given location on the track yuck", () => {
    const location: TrackLocation = {
      x: 4100,
      y: 4925,
      z: 0,
      driverNumber: 1,
      date: 0,
    };
    const percentage = service.translateLocation(location);
    console.log(`Percentage for location (4100, 4925): ${percentage}`);
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
    expect(percentage).toBeCloseTo(0.5, 1);
  });
});
