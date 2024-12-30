import type { Driver } from "./IDriverService";
import type IDriverService from "./IDriverService";

export default class DriverService implements IDriverService {
  private static DRIVERS_URL = "https://api.openf1.org/v1/drivers";

  private static TEAM_COLOR_OVERRIDES: Record<string, string> = {
    "Red Bull Racing": "0053C7",
    Alpine: "DE00FF",
    "Aston Martin": "009966",
    "Haas F1 Team": "F5FAFD",
    "Kick Sauber": "00E300",
    Mercedes: "00F5CC",
  };

  async getDrivers(): Promise<Driver[]> {
    const requestUrl = new URL(DriverService.DRIVERS_URL);
    requestUrl.searchParams.append("session_key", "latest");
    let payload;
    try {
      console.log("Requesting drivers from", requestUrl.toString());
      const request = await fetch(requestUrl);
      console.log("Response status", request.status);
      payload = await request.json();
    } catch (error) {
      console.error(error);
      console.log(payload);
      return [];
    }

    if (!Array.isArray(payload)) {
      throw new Error("Invalid response from server");
    }

    return payload.map((driver) => ({
      // fullName: driver.full_name,
      // lastName: driver.last_name,
      // nameAcronym: driver.name_acronym,
      c:
        DriverService.TEAM_COLOR_OVERRIDES[driver.team_name] ||
        driver.team_colour,
      n: driver.driver_number,
    }));
  }
}
