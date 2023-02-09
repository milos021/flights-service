import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { FlightService } from './flight.service';

const flights = [
  {
    slices: [
      {
        origin_name: 'Schonefeld',
        destination_name: 'Stansted',
        departure_date_time_utc: '2019-08-08T04:30:00.000Z',
        arrival_date_time_utc: '2019-08-08T06:25:00.000Z',
        flight_number: '144',
        duration: 115,
      },
      {
        origin_name: 'Stansted',
        destination_name: 'Schonefeld',
        departure_date_time_utc: '2019-08-10T05:35:00.000Z',
        arrival_date_time_utc: '2019-08-10T07:35:00.000Z',
        flight_number: '8542',
        duration: 120,
      },
    ],
    price: 129,
  },
];

const flightsInvalid = {
  updatedAt: new Date(2023, 2, 9, 3, 24, 0),
  flights,
};

const flightsValid = {
  updatedAt: new Date(),
  flights,
};

describe('FlightService', () => {
  let app: TestingModule;
  let service: FlightService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [FlightService, { provide: CACHE_MANAGER, useValue: {} }],
    }).compile();
    service = app.get<FlightService>(FlightService);
  });

  describe('Init', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('It should return flights', () => {
    it('should return array of flights', async () => {
      const result = of(flights);
      jest.spyOn(service, 'getAllFlights').mockImplementation(() => result);

      expect(await service.getAllFlights()).toBe(result);
    });
  });

  describe('It should test if the flights are valid (not older then one hour)', () => {
    it('should return array of flights', async () => {
      jest.spyOn(service, 'areFlightsValid').mockImplementation(() => false);

      expect(await service.areFlightsValid(flightsInvalid)).toBe(false);
      expect(await service.areFlightsValid(flightsValid)).toBe(false);
    });
  });
});
