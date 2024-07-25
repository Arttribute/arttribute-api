import { config } from 'dotenv';
config();

import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import morgan from 'morgan';
import { AppModule } from './app.module';

export async function nestServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use(morgan('short'));

  app.use(cookieParser());

  app.use(json({ limit: '50mb' }));
  //   app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableVersioning({ type: VersioningType.URI });

  return app;
}
