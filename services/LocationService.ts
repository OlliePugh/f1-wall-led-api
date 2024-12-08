import type ILocationService from "./ILocationService";
import type { TrackLocation } from "./ILocationService";
import { EventEmitter } from "events";

export default class LocationService
  extends EventEmitter<{ location: [TrackLocation[]] }>
  implements ILocationService
{
  private static readonly LOCATIONS_URL = "https://api.openf1.org/v1/location";
  private static readonly POLLING_TIME = 5000;
  private static readonly KEEP_DATA_FOR = 10_000;

  private actualStartTime: number;
  public locations: TrackLocation[] = [];

  constructor(
    private readonly timeBehindLive: number,
    private readonly startTime: number = Date.now()
  ) {
    super();
    this.actualStartTime = Date.now();
  }

  async initialise() {
    this.fetchLocations();
    setInterval(this.fetchLocations.bind(this), LocationService.POLLING_TIME);
  }

  async fetchLocations(): Promise<TrackLocation[]> {
    const requestUrl = new URL(LocationService.LOCATIONS_URL);
    // requestUrl.searchParams.append("session_key", "latest");
    console.log(this.startTime);
    console.log(this.actualStartTime);
    const currentNow = this.startTime + (Date.now() - this.actualStartTime);

    const afterTime = new Date(
      currentNow - this.timeBehindLive - LocationService.KEEP_DATA_FOR
    ).toISOString();
    const beforeTime = new Date(currentNow - this.timeBehindLive).toISOString();

    const builtUrl = `${requestUrl.toString()}?date>${afterTime}&date<${beforeTime}`;

    let payload;
    let request;
    try {
      console.log("Fetching locations from", builtUrl);
      request = await fetch(builtUrl);
      payload = await request.json();
    } catch (error) {
      console.error(error);
      console.log(request);
      return [];
    }

    if (!Array.isArray(payload)) {
      throw new Error("Invalid response from server");
    }

    const locations: TrackLocation[] = payload.map((item: any) => {
      const location: TrackLocation = {
        driverNumber: item.driver_number,
        x: item.x,
        y: item.y,
        z: item.z,
        date: item.date,
      };
      return location;
    });

    locations.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.updateLocations(locations);
    return locations;
  }

  private removeOutdatedLocations() {
    const currentNow = this.startTime + (Date.now() - this.actualStartTime);
    const timeToKeep = currentNow - LocationService.KEEP_DATA_FOR;

    this.locations = this.locations.filter(
      (x) => new Date(x.date).getTime() > timeToKeep
    );
  }

  updateLocations(newLocations: TrackLocation[]) {
    const firstLocationTimeInNewLocations = newLocations?.[0]?.date;

    this.removeOutdatedLocations();

    if (!firstLocationTimeInNewLocations) {
      // no locations to add
      return;
    }

    const intersectingLocation = this.locations.findIndex(
      (x) =>
        new Date(x.date).getTime() ==
          new Date(firstLocationTimeInNewLocations).getTime() &&
        x.driverNumber === newLocations[0].driverNumber &&
        x.x === newLocations[0].x &&
        x.y === newLocations[0].y &&
        x.z === newLocations[0].z
    );

    // no intersection add them to the end
    if (intersectingLocation === -1) {
      this.locations.push(...newLocations);
      return;
    }

    // remove locations that occur after the first location in the new locations
    this.locations = this.locations
      .slice(0, intersectingLocation)
      .concat(newLocations);

    this.emit("location", this.locations);
  }
}
