import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  type FindWeatherByCityQueryParamsDto,
  findWeatherByCityQueryParamsSchema,
} from './weather.dto.js';
import { WeatherService } from './weather.service.js';
import { WeatherGuard } from './weather.guard.js';

@Controller('weather')
@UseGuards(WeatherGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async findWeatherByCity(
    @Query({ schema: findWeatherByCityQueryParamsSchema })
    { city }: FindWeatherByCityQueryParamsDto,
  ) {
    const weather = this.weatherService.searchWeatherByCity({
      city,
    });

    return weather;
  }
}
