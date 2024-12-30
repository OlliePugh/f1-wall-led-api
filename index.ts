import DriverService from "./services/DriverService";
import LocationService from "./services/LocationService";
import PercentageTrackLocationTranslationService from "./services/PercentageTrackLocationTranslationService";
import type { TrackLocation } from "./services/ILocationService";
import fs from "fs";
import path from "path";
import type { Coordinate } from "./services/Coordinate";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const port = 8080;
const fakeStartTime = new Date("2024-12-08T13:10:00.200Z");
// const fakeStartTime = new Date();

// load in data/singapore-2023-track.json
const trackData: Coordinate[] = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "data/abu-dhabi-2024-track.json"),
    "utf-8"
  )
);

const driverService = new DriverService();
const trackPositionTranslaterService =
  new PercentageTrackLocationTranslationService(trackData);
const locationService = new LocationService(25_000, fakeStartTime.getTime());
const drivers = await driverService.getDrivers();

app.get("/locations", (req, res) => {
  console.log("GET /locations");
  const baselineTime = locationService.locations?.[0]?.date;
  const baseline =
    baselineTime != null
      ? new Date(baselineTime).getTime()
      : new Date().getTime();
  console.log("baseline", baseline);
  res.send({
    baseline: baseline,
    test: "123",
    locations: locationService.locations.map((x) => ({
      // number
      n: x.driverNumber,
      // date
      d: new Date(x.date).getTime() - baseline,
      // location
      l: trackPositionTranslaterService.translateLocation(x),
    })),
    drivers: drivers,
  });
});

app.get("/drivers", (req, res) => {
  console.log("GET /drivers");
  res.send(drivers);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

locationService.initialise();
