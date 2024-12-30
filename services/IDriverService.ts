export type Driver = {
  // fullName: string;
  // lastName: string;
  // nameAcronym: string;
  // colour
  c: string;
  // number
  n: number;
};

export default interface IDriverService {
  getDrivers(): Promise<Driver[]>;
}
