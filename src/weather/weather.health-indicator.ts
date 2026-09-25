import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { WeatherService } from './weather.service.js';

@Injectable()
export class WeatherHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly weatherService: WeatherService,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check('weather');

    try {
      const isHealthy = await this.weatherService.isHealthy();

      if (isHealthy) {
        return indicator.up();
      }

      return indicator.down();
    } catch {
      return indicator.down();
    }
  }
}
