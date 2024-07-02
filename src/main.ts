import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import { EnvironmentVariables } from './_utils/config/config';
import { MongoDBExceptionFilter } from './_utils/exceptions/query-duplicate.exception';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app
    .setGlobalPrefix('api')
    .useGlobalFilters(new MongoDBExceptionFilter())
    .useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    .enableCors();

  const config = new DocumentBuilder()
    .setTitle('NestJS Skeleton API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const theme = new SwaggerTheme();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true,
    },
    customCss: theme.getBuffer(<SwaggerThemeName>'dark'),
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document, customOptions);

  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  await app.listen(configService.get('PORT'));
  Logger.debug(
    `Server running on http://localhost:${configService.get('PORT')}`,
  );
}
bootstrap();
