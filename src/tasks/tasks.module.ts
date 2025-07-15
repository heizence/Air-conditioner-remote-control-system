/**
 * tasks 와 관련된 모든 구성 요소들을 하나의 기능 단위로 묶어주는 역할을 하는 파일
 */
import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TasksService } from './tasks.service';

// @ Module() 데코레이터는 이 클래스가 tasks 기능을 담당하는 모듈임을 선언합니다.
@Module({
  imports: [DatabaseModule],
  providers: [TasksService], // 이 모듈 내에서 사용할 서비스들을 등록한다
})
export class TasksModule {}
