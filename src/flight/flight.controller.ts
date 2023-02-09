import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Flight } from './flight.interface';
import { FlightService } from './flight.service';

@Controller('flights')
export class FlightController {
  constructor(private flightService: FlightService) {}

  @Get()
  getAllFlights(): Observable<Flight[]> {
    return this.flightService.getAllFlights();
  }
}
