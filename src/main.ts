import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { inspect } from 'util';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
      exceptionFactory: (errors) => {
        // console.log(errors);
        for (const error of errors) {
          console.log(
            inspect(error, {
              showHidden: false,
              depth: null,
              colors: true,
            }),
          );
        }
        return new BadRequestException(errors);
      },
    }),
  );

  const port = process.env.PORT || 5000;

  await app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
}
bootstrap();
