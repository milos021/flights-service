import { Flight } from "./flight.interface";

export class FlightUtil {
  static getUniqueFlights(data): Flight[] {
    return data
      .map((item) => item.data.flights)
      .reduce((a, c) => a.concat(c), [])
      .reduce((unique, o) => {
        if (
          !unique.some(
            (obj) => JSON.stringify(obj.slices) === JSON.stringify(o.slices),
          )
        ) {
          unique.push(o);
        }
        return unique;
      }, []);
  }
}
