// Demo-only state. It will be replaced by the driver's availability API.
let driverAvailable = true;

export function getDriverAvailability(): boolean {
  return driverAvailable;
}

export function setDriverAvailability(value: boolean): boolean {
  driverAvailable = value;
  return driverAvailable;
}
