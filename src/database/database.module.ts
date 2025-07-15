/**
 * DatabaseService 를 감싸고 다른 모듈에서 가져다 쓸 수 있도록 export 하는 역할을 하는 파일
 */

import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

// @Module() 데코레이터는 이 클래스가 NestJS 모듈임을 선언합니다.
// 모듈은 관련된 기능(컨트롤러, 서비스 등)을 캡슐화하는 단위입니다.
@Module({
  // providers 배열에는 이 모듈 내에서 사용할 서비스(Provider)들을 등록합니다.
  // 여기에 등록된 서비스는 NestJS의 의존성 주입 시스템이 인스턴스를 관리해줍니다.
  providers: [DatabaseService],

  // exports 배열에는 이 모듈이 외부의 다른 모듈에게 '공개'할 서비스들을 등록합니다.
  // 여기에 등록된 서비스는 다른 모듈에서 'imports'하여 사용할 수 있게 됩니다.
  exports: [DatabaseService],
})
// DatabaseModule 클래스를 정의하고 외부에서 사용할 수 있도록 export 합니다.
export class DatabaseModule {}
