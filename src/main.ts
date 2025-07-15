/**
 * NestJS 애플리케이션을 시작하는 진입점입니다.
 * 전역 파이프, swagger 문서화, 포트 설정 등 앱 전체에 적용될 설정을 담당합니다.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // 의미 : DTO 클래스에 class-validator 데코레이터가 붙어있는 허용된 속성들만 통과시키겠다.
      // 동작 : class-validator 데코레이터가 없는 속성은 허용되지 않은 속성으로 간주된다.
      // 만약 forbidNonWhitelisted 옵션이 없다면, 이 옵션은 허용되지 않은 속성은 조용히 제거한다.
      whitelist: true,

      // 의미 : 만약 허용되지 않은 속성이 요청에 포함되어 있다면, 조용히 제거하지 말고 즉시 에러를 발생시켜라.
      // 동작 : 이 옵션 때문에, DTO 에 데코레이터 없이 정의된 속성이나 DTO 에 없는 속성이 요청에 포함되면,
      // ValidationPipe 는 400 Bad Request 에러와 함께 "property [속성이름] should not exist" 라는 명확한 메시지를 클라이언트에게 반환한다.
      forbidNonWhitelisted: true,

      // 이처럼 엄격한 규칙을 사용하는 이유는, 클라이언트가 API 명세에 없는 임의의 데이터를 서버로 보내는 것을 막고,
      // 항상 예측 가능하고 명확한 데이터 구조만을 허용하여 API의 안정성을 높이기 위함이다.
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
