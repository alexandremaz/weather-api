import {
  Module,
  StandardSchemaSerializerInterceptor,
  StandardSchemaValidationPipe,
} from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import configInjection from './config/config-injection.js';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { WeatherModule } from './weather/weather.module.js';
import { LoggerModule } from 'nestjs-pino';
import { type ConfigType } from '@nestjs/config';
import { destination } from 'pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configInjection],
    }),
    LoggerModule.forRootAsync({
      inject: [configInjection.KEY],
      useFactory: (config: ConfigType<typeof configInjection>) => {
        return {
          pinoHttp: [
            {
              level: config.NODE_ENV === 'production' ? 'info' : 'debug',
              transport: !['production', 'ci'].includes(config.NODE_ENV)
                ? {
                    target: 'pino-pretty',
                  }
                : undefined,
            },
            destination(),
          ],
        };
      },
    }),
    HealthModule,
    WeatherModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new StandardSchemaValidationPipe({
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: StandardSchemaSerializerInterceptor,
    },
  ],
})
export class AppModule {}
