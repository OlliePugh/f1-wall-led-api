import { request } from "express";
import type { Driver } from "./IDriverService";
import type IDriverService from "./IDriverService";

export default class DriverService implements IDriverService {
  private static DRIVERS_URL = "https://api.openf1.org/v1/drivers";

  async getDrivers(): Promise<Driver[]> {
    const requestUrl = new URL(DriverService.DRIVERS_URL);
    requestUrl.searchParams.append("session_key", "latest");
    // requestUrl.searchParams.append("meeting_key", "latest");
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
      fullName: driver.full_name,
      lastName: driver.last_name,
      nameAcronym: driver.name_acronym,
      teamColor: driver.team_colour,
      driverNumber: driver.driver_number,
    }));
  }
}
