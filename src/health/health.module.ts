import { Logger, Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { WeatherModule } from '../weather/weather.module.js';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
    WeatherModule,
  ],
  controllers: [HealthController],
  providers: [Logger],
})
export class HealthModule {}
