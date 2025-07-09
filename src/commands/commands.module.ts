// src/commands/commands.module.ts (수정 후)

// NestJS의 기본 Module 데코레이터를 가져옵니다.
import { Module } from '@nestjs/common';
// 현재 모듈의 Service를 가져옵니다.
import { CommandsService } from './commands.service';
// 현재 모듈의 Controller를 가져옵니다.
import { CommandsController } from './commands.controller';
// ✨ 1. 사용하려는 DatabaseModule을 import 합니다.
import { DatabaseModule } from '../database/database.module';

@Module({
  // ✨ 2. imports 배열에 DatabaseModule을 추가합니다.
  imports: [DatabaseModule],
  // 이 모듈에서 사용할 컨트롤러들을 등록합니다.
  controllers: [CommandsController],
  // 이 모듈에서 사용할 서비스(Provider)들을 등록합니다.
  providers: [CommandsService],
})
export class CommandsModule {}
