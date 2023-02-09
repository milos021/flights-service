import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import {
  catchError,
  combineLatest,
  find,
  from,
  interval,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap,
  take,
  tap,
  timeout,
} from 'rxjs';
import { flightsApiEndpoints } from './flight.constants';
import { Flight, FlightsCache } from './flight.interface';
import { FlightUtil } from './flight.util';

@Injectable()
export class FlightService implements OnModuleInit, OnModuleDestroy {
  subscription$ = new Subscription();

  constructor(
    protected httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.updateFlightsEveryHour();
  }

  updateFlightsEveryHour(): void {
    this.subscription$.add(
      interval(3600000)
        .pipe(
          startWith(0),
          map(() => this.getFlightsPoll()))
        .subscribe(),
    );
  }

  getFlightsPoll(): void {
    this.subscription$.add(
      interval(2000)
        .pipe(
          startWith(0),
          take(6 * 5),
          switchMap(() => this.getAllFlightsFromApi()),
          find((flights) => !!flights?.length),
        )
        .subscribe(),
    );
  }

  getAllFlights(): Observable<Flight[]> {
    return this.getFlightsFromCache().pipe(
      switchMap((data) => {
        if (data && this.areFlightsValid(data)) {
          return of(data.flights);
        } else {
          return this.getAllFlightsFromApi();
        }
      }),
    );
  }

  setFlightsCache(flights): void {
    this.cacheManager.set(
      'flights',
      {
        updatedAt: new Date(),
        flights,
      },
      3600000,
    );
  }

  getFlightsFromCache(): Observable<FlightsCache> {
    return from(this.cacheManager.get('flights')) as Observable<FlightsCache>;
  }

  areFlightsValid(data): boolean {
    const newDate = new Date();
    return Math.abs(data?.updatedAt?.valueOf() - newDate.valueOf()) / 36e5 < 1;
  }

  getAllFlightsFromApi(): Observable<Flight[]> {
    const flightsHttpEndpoints = flightsApiEndpoints.map((flight) =>
      this.httpService.get<any>(flight),
    );
    return combineLatest(flightsHttpEndpoints).pipe(
      timeout(1000),
      map((res) => {
        const uniqueFlights = FlightUtil.getUniqueFlights(res);
        this.setFlightsCache(uniqueFlights);
        return uniqueFlights;
      }),
      catchError((err) => {
        return of(err.message);
      }),
    );
  }

  onModuleDestroy(): void {
    this.subscription$.unsubscribe();
    this.cacheManager.del('flights');
  }
}
