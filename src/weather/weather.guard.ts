import {
  type CanActivate,
  type ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { Request } from 'express';
import configInjection from '../config/config-injection.js';
@Injectable()
export class WeatherGuard implements CanActivate {
  constructor(
    @Inject(configInjection.KEY)
    private readonly config: ConfigType<typeof configInjection>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey =
      this.config.NODE_ENV === 'production'
        ? request.headers['x-api-key']
        : request.headers['x-api-key'] || '';

    return apiKey === this.config.API_KEY;
  }
}
