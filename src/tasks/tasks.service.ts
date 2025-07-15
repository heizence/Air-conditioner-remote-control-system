/**
 * @nestjs/schedule 의 @Cron 데코레이터를 사용하여, 주기적으로 실행되어야 할 배치 작업(디바이스 상태 점검, 명령 만료 처리) 로직을 포함하는 파일
 */
import { Injectable, Logger } from '@nestjs/common'; // NestJS에서 필요한 Injectable 데코레이터와 로그 기록을 위한 Logger 클래스
import { Cron, CronExpression } from '@nestjs/schedule'; // 스케줄링(주기적인 작업 실행)을 위한 @Cron 데코레이터와 CronExpression enum
import { DatabaseService } from '../database/database.service';
import { Device } from '../devices/interfaces/device.interface';
import { Command } from '../commands/interfaces/command.interface';
import { Status } from '../common/common.enums';

// @Injectable() 데코레이터는 이 클래스가 NestJS의 Provider임을 나타냅니다.
@Injectable()
export class TasksService {
  // 이 서비스의 로그를 기록하기 위한 Logger 인스턴스를 생성합니다. 'TasksService'라는 컨텍스트 이름이 로그에 표시됩니다.
  private readonly logger = new Logger(TasksService.name);

  // 생성자를 통해 DatabaseService를 주입받습니다.
  constructor(private readonly dbService: DatabaseService) {}

  // @Cron() 데코레이터는 이 메소드가 스케줄에 따라 주기적으로 실행되도록 설정합니다.
  // process.env.CRON_SCHEDULE 값이 있으면 그 값을, 없으면 기본값으로 '매 1분마다'(EVERY_MINUTE)를 사용합니다.
  @Cron(process.env.CRON_SCHEDULE || CronExpression.EVERY_MINUTE)
  // 주기적으로 실행될 비동기 메소드입니다.
  async handleCron() {
    // 배치 작업이 시작되었음을 디버그 레벨 로그로 기록합니다.
    this.logger.debug('배치 작업을 시작합니다...');

    // 현재 시간을 상수로 저장하여, 이 메소드 내에서 일관된 시간 기준으로 사용합니다.
    const now = new Date();
    // .env 파일에서 디바이스 오프라인 기준 시간(분)을 가져와 숫자로 변환합니다.
    const offlineMinutes = Number(process.env.DEVICE_OFFLINE_MINUTES!);
    // .env 파일에서 명령 만료 기준 시간(분)을 가져와 숫자로 변환합니다.
    const expireMinutes = Number(process.env.COMMAND_EXPIRE_MINUTES!);

    // --- 1. 디바이스 오프라인 처리 로직 ---
    // DB의 '/devices' 경로에 있는 모든 디바이스 데이터를 가져옵니다.
    const devices: Device[] = await this.dbService.db.getData('/devices');

    // 가져온 모든 디바이스에 대해 반복문을 실행합니다.
    for (const device of devices) {
      // 각 디바이스의 마지막 통신 시간을 Date 객체로 변환합니다.
      const lastPing = new Date(device.lastPingAt);
      // 현재 시간과 마지막 통신 시간의 차이를 '분' 단위로 계산합니다.
      const diffMinutes = (now.getTime() - lastPing.getTime()) / (1000 * 60);

      // 시간 차이가 설정된 오프라인 기준 시간 이상이고, 현재 디바이스 상태가 'online'이면
      if (diffMinutes >= offlineMinutes && device.status === Status.ONLINE) {
        // 해당 디바이스를 오프라인 처리한다는 로그를 기록합니다.
        this.logger.log(`디바이스 ${device.id}를 offline으로 변경합니다.`);
        // DB에서 해당 디바이스의 인덱스를 찾습니다.
        const deviceIndex = await this.dbService.db.getIndex(
          '/devices',
          device.id,
          'id',
        );
        // 찾은 인덱스를 이용하여 해당 디바이스의 상태를 'OFFLINE'으로 업데이트합니다.
        await this.dbService.db.push(
          `/devices[${deviceIndex}]/status`,
          Status.OFFLINE,
        );
      }
    }

    // --- 2. 만료된 명령 처리 로직 ---
    // DB에서 status가 'PENDING'인 모든 명령들을 필터링하여 가져옵니다.
    const pendingCommands = await this.dbService.db.filter<Command>(
      '/commands',
      (cmd) => cmd.status === Status.PENDING,
    );
    // 가져온 pending 상태의 명령들에 대해 반복문을 실행합니다. (null일 경우를 대비해 ?? [] 사용)
    for (const command of pendingCommands ?? []) {
      // 각 명령의 생성 시간을 Date 객체로 변환합니다.
      const createdAt = new Date(command.createdAt);
      // 현재 시간과 명령 생성 시간의 차이를 '분' 단위로 계산합니다.
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      // 시간 차이가 설정된 명령 만료 기준 시간 이상이면
      if (diffMinutes >= expireMinutes) {
        // 해당 명령을 만료 처리한다는 로그를 기록합니다.
        this.logger.log(`명령 ${command.id}를 expired로 변경합니다.`);
        // DB에서 해당 명령의 인덱스를 찾습니다.
        const commandIndex = await this.dbService.db.getIndex(
          '/commands',
          command.id,
          'id',
        );
        // 찾은 인덱스를 이용하여 해당 명령의 상태를 'EXPIRED'로 업데이트합니다.
        await this.dbService.db.push(
          `/commands[${commandIndex}]/status`,
          Status.EXPIRED,
        );
      }
    }

    // 배치 작업이 완료되었음을 디버그 레벨 로그로 기록합니다.
    this.logger.debug('배치 작업을 완료했습니다.');
  }
}
