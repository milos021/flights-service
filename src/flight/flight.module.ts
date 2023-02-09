import { FlightService } from './flight.service';
import { CacheModule, Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [FlightController],
  providers: [FlightService],
  exports: [FlightService]
})
export class FlightModule {}
