import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { isAxiosError } from 'axios';
import configInjection from '../config/config-injection.js';
import { type ConfigType } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { getWeatherEmoji } from './weather.emoji.js';
import * as z from 'zod';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
    @Inject(configInjection.KEY)
    private readonly config: ConfigType<typeof configInjection>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchWeatherByCity({ city }: { city: string }): Promise<string> {
    const cachedWeather = await this.cacheManager.get<string>(city);
    if (cachedWeather) {
      return cachedWeather;
    }

    if (
      !this.config.OPEN_WEATHER_MAP_API_KEY ||
      !this.config.OPEN_WEATHER_MAP_URL
    ) {
      this.logger.log(
        'Non-production environment without enough information on open weather map api',
      );
      return 'orage 🌩️';
    }

    const { OPEN_WEATHER_MAP_API_KEY: apiKey, OPEN_WEATHER_MAP_URL: url } =
      this.config;
    const params = new URLSearchParams();
    params.append('q', city);
    params.append('APPID', apiKey);
    params.append('lang', 'fr');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{
          cod: number;
          weather: { main: string }[];
        }>(url, {
          params,
        }),
      );

      if (data.cod !== 200) {
        throw new Error('Response Code is not 200');
      }
      const { description, icon } = z
        .object({
          description: z.string().min(1),
          icon: z.string().length(3),
        })
        .parse(data.weather[0]);
      const result =
        description + ' ' + getWeatherEmoji(icon.slice(0, -1)) + ' \n';
      this.logger.log({
        result,
      });
      await this.cacheManager.set(city, result, 300000);
      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        this.logger.error('Call to weather external API failed', {
          cause: error.cause,
          message: error.message,
          status: error.status,
        });

        throw new HttpException(
          {
            cause: error.cause,
            message: error.message,
            status: error.status,
          },
          error.status || HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.error(
        `Searching weather by city failed: ${error instanceof Error ? error.message : ''}`,
      );
      throw new HttpException(
        'Could not search weather by city',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async isHealthy() {
    await this.searchWeatherByCity({ city: 'Paris' });
    return true;
  }
}
