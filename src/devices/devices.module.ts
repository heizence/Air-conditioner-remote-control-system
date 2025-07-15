/**
 * devices 와 관련된 모든 구성 요소를 하나의 기능 단위로 묶어주는 역할을 하는 파일
 */
import { Module } from '@nestjs/common'; // NestJS 에서 모듈을 정의하기 위한 @Module 데코레이터
import { DatabaseModule } from 'src/database/database.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

// @Module() 데코레이터는 이 클래스가 devices 기능을 담당하는 모듈임을 선언합니다.
@Module({
  imports: [DatabaseModule],
  controllers: [DevicesController], // 이 모듈에서 처리할 DevicesController 를 등록한다.
  providers: [DevicesService], // 이 모듈 내에서 사용할 서비스들을 등록한다
})
// 외부에서 사용할 수 있도록 export
export class DevicesModule {}
