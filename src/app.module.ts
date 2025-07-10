import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CommandsModule } from './commands/commands.module';
import { DevicesModule } from './devices/devices.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true 옵션은 다른 모듈에서 ConfigModule을 import하지 않아도 ConfigService를 주입하여 사용할 수 있게 해 쥼
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CommandsModule,
    DevicesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
