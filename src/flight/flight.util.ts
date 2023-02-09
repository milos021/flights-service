import { Flight } from "./flight.interface";

export class FlightUtil {
  static getUniqueFlights(data): Flight[] {
    return data
      .map((item) => item.data.flights)
      .reduce((a, c) => a.concat(c), [])
      .reduce((unique, o) => {
        if (
          !unique.some((obj: Flight) =>
            obj.slices.every((slice) => {
              return o.slices.some(
                (y) =>
                  `${y.flight_number}${y.arrival_date_time_utc}${y.departure_date_time_utc}` ===
                  `${slice.flight_number}${slice.arrival_date_time_utc}${slice.departure_date_time_utc}`,
              );
            }),
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);
  }
}
