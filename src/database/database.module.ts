// NestJS의 기본 Module 데코레이터를 가져옵니다.
import { Module } from '@nestjs/common';
// 현재 모듈의 Service를 가져옵니다.
import { DatabaseService } from './database.service';

@Module({
  // 이 모듈에서 사용할 서비스(Provider)들을 등록합니다.
  providers: [DatabaseService],
  // providers에 등록된 서비스 중, 다른 모듈에서 사용할 서비스를 공개(export)합니다.
  exports: [DatabaseService],
})
export class DatabaseModule {}
