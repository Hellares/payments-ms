import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CONSOLE_COLORS } from 'colors.constants';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger(`${CONSOLE_COLORS.STYLE.UNDERSCORE}${CONSOLE_COLORS.TEXT.MAGENTA}Payments-ms`);

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: envs.natsServers,
    },
  },{
    inheritAppConfig: true,
  });

  await app.startAllMicroservices();

  await app.listen(envs.port);

  logger.log(`${CONSOLE_COLORS.STYLE.UNDERSCORE}${CONSOLE_COLORS.TEXT.CYAN}Payments Microservices is running on port ${envs.port}`);
}
bootstrap();
