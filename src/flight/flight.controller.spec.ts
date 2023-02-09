import { HttpModule } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FlightController } from './flight.controller';
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

const mockFlightsService = {
  getAllFlights: jest.fn(() => flights),
};

describe('FlightController', () => {
  let app: TestingModule;
  let controller: FlightController;
  let service: FlightService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FlightController],
      providers: [FlightService, { provide: CACHE_MANAGER, useValue: {} }],
    })
      .overrideProvider(FlightService)
      .useValue(mockFlightsService)
      .compile();
    service = app.get<FlightService>(FlightService);
    controller = app.get<FlightController>(FlightController);
  });

  describe('Init', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('getAllFlights', () => {
    it('should return array of flights', () => {
      expect(controller.getAllFlights()).toEqual(flights);
    });
  });
});
