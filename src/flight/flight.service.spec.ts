import { HttpModule, HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FlightService } from './flight.service';

describe('AppController', () => {
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
});
