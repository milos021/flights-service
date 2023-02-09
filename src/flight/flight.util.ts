import { Flight } from "./flight.interface";

export class FlightUtil {
  static getUniqueFlights(data): Flight[] {
    return data
      .map((item) => item.data.flights)
      .reduce((package1, package2) => package1.concat(package2), [])
      .reduce((unique, flight) => {
        if (
          !unique.some((obj: Flight) =>
            obj.slices.every((slice1) => {
              return flight.slices.some(
                (slice2) =>
                  `${slice2.flight_number}${slice2.arrival_date_time_utc}${slice2.departure_date_time_utc}` ===
                  `${slice1.flight_number}${slice1.arrival_date_time_utc}${slice1.departure_date_time_utc}`,
              );
            }),
          )
        ) {
          unique.push(flight);
        }
        return unique;
      }, []);
  }
}
