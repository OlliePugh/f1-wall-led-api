export type Driver = {
  fullName: string;
  lastName: string;
  nameAcronym: string;
  teamColor: string;
  driverNumber: number;
};

export default interface IDriverService {
  getDrivers(): Promise<Driver[]>;
}
