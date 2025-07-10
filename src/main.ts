import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 요청에서 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성이 들어오면 에러를 발생시킨다.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('에어컨 리모컨 API')
    .setDescription('IoT 에어컨 제어 시스템을 위한 API 명세서입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  const port = Number(process.env.PORT!);
  await app.listen(port);
}

bootstrap();
