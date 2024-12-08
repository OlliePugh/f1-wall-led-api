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
const fakeStartTime = new Date("2024-12-06T13:10:00.200Z");
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
const locationService = new LocationService(5_000, fakeStartTime.getTime());
const drivers = await driverService.getDrivers();

app.get("/locations", (req, res) => {
  console.log("GET /locations");
  res.send({
    locations: locationService.locations.map((x) => ({
      driverNumber: x.driverNumber,
      date: new Date(x.date).getTime(),
      location: trackPositionTranslaterService.translateLocation(x),
    })),
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
