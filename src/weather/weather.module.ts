import { Logger, Module } from '@nestjs/common';
import { WeatherController } from './weather.controller.js';
import { WeatherService } from './weather.service.js';
import { WeatherHealthIndicator } from './weather.health-indicator.js';
import { CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: Logger,
    }),
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherHealthIndicator, Logger],
  exports: [WeatherHealthIndicator],
})
export class WeatherModule {}
