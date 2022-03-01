import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger } from "@nestjs/common";

const logger: Logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('server.port');
  app.use(cookieParser());
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
