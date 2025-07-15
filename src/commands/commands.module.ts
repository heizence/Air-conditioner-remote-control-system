/**
 * commands 와 관련된 모든 구성 요소를 하나의 기능 단위로 묶어주는 역할을 하는 파일
 */
import { Module } from '@nestjs/common'; // NestJS에서 모듈을 정의하기 위한 @Module 데코레이터
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { DatabaseModule } from '../database/database.module';

// @Module() 데코레이터는 이 클래스가 commands 기능을 담당하는 모듈임을 선언합니다.
@Module({
  // imports 배열에는 이 모듈이 '의존'하는 다른 모듈들을 등록합니다.
  // CommandsService가 DatabaseService를 사용해야 하므로, DatabaseModule을 여기에 추가합니다.
  // 이렇게 함으로써, CommandsModule 내에서 DatabaseService를 주입받아 사용할 수 있게 됩니다.
  imports: [DatabaseModule],

  // controllers 배열에는 이 모듈이 처리할 컨트롤러들을 등록합니다.
  // NestJS는 여기에 등록된 컨트롤러를 보고 HTTP 라우팅을 설정합니다.
  controllers: [CommandsController],

  // providers 배열에는 이 모듈 내에서 사용할 서비스(비즈니스 로직)들을 등록합니다.
  // 여기에 등록된 서비스는 이 모듈의 컨트롤러나 다른 서비스에 주입될 수 있습니다.
  providers: [CommandsService],
})
// CommandsModule 클래스를 정의하고 외부(app.module.ts)에서 사용할 수 있도록 export 합니다.
export class CommandsModule {}
