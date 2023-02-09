import { FlightModule } from './flight/flight.module';
import { FlightController } from './flight/flight.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [FlightModule],
  controllers: [FlightController, AppController],
  providers: [AppService],
})
export class AppModule {}
