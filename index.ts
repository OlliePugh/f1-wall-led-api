import DriverService from "./services/DriverService";
import LocationService from "./services/LocationService";
import PercentageTrackLocationTranslationService from "./services/PercentageTrackLocationTranslationService";
import type { TrackLocation } from "./services/ILocationService";
import fs from "fs";
import path from "path";
import type { Coordinate } from "./services/Coordinate";

const timeBehind = 20_000; // aim to be 20 seconds behind
const fakeStartTime = new Date("2024-09-22T12:03:35.200Z");
const actualStartTime = Date.now();

// load in data/singapore-2023-track.json
const trackData: Coordinate[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data/singapore-2023-track.json"),
    "utf-8"
  )
);

const driverService = new DriverService();
const trackPositionTranslaterService =
  new PercentageTrackLocationTranslationService(trackData);
const locationService = new LocationService(10_000, fakeStartTime.getTime());

const timings: TrackLocation[] = [];

locationService.on("location", (locations) => {
  timings.push(...locations);
});

const printCar1 = () => {
  const fakeCurrentNow =
    fakeStartTime.getTime() + (Date.now() - actualStartTime);

  const currentOffsetTime = fakeCurrentNow - timeBehind;
  const firstFutureTiming = timings.findIndex(
    (x) => new Date(x.date).getTime() > currentOffsetTime
  );
  const pastTimings = timings.splice(0, firstFutureTiming);

  const last = pastTimings.findLast((x) => x.driverNumber === 1);

  if (!last) {
    setTimeout(printCar1, 100);
    return;
  }
  console.log(trackPositionTranslaterService.translateLocation(last));
  const csvLine = `${last.x},${last.y},${last.z}\n`;
  const filePath = path.join(__dirname, "positions.csv");

  fs.appendFile(filePath, csvLine, () => {});
  // wait until next car 1 time
  const nextData = pastTimings.find((x) => x.driverNumber === 1);
  if (!nextData) {
    // try again in 1/10s
    setTimeout(printCar1, 100);
  } else {
    const nextTime = new Date(nextData.date).getTime();
    const timeUntilNext = nextTime - currentOffsetTime;
    setTimeout(printCar1, timeUntilNext);
  }
};

// setInterval(() => {
//   console.log(locationService.locations.length);
// }, 1000);

printCar1();
locationService.initialise();
