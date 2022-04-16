// Libraries
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import fastifyCookie from 'fastify-cookie';
import helmet from 'helmet';

// Modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(fastifyCookie, {
    secret: 'my-secret',
  });

  const config = new DocumentBuilder()
    .setTitle('Concrete Solvents')
    .setDescription('The Concrete Solvents API description')
    .setVersion('0.01')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: process.env.ORIGIN,
  });

  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log(`Server start on ${port}`);
  });
}

bootstrap();
