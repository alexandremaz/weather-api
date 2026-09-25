import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

import { WeatherHealthIndicator } from '../weather/weather.health-indicator.js';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private weatherHealthIndicator: WeatherHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.weatherHealthIndicator.isHealthy()]);
  }
}
