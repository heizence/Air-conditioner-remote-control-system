import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { Device } from '../devices/interfaces/device.interface';
import { Command } from '../commands/interfaces/command.interface';
import { Status } from '../common/common.enums';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly dbService: DatabaseService) {}

  // 매 1분마다 이 메소드를 실행
  @Cron(process.env.CRON_SCHEDULE || CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('배치 작업을 시작합니다...');

    const now = new Date();
    const offlineMinutes = Number(process.env.DEVICE_OFFLINE_MINUTES!);
    const expireMinutes = Number(process.env.COMMAND_EXPIRE_MINUTES!);

    // 1. 디바이스 오프라인 처리
    const devices: Device[] = await this.dbService.db.getData('/devices');

    for (const device of devices) {
      const lastPing = new Date(device.lastPingAt);
      // 현재 시간과 마지막 통신 시간의 차이(분)를 계산
      const diffMinutes = (now.getTime() - lastPing.getTime()) / (1000 * 60);

      // 차이가 5분 이상이고, 현재 상태가 'online'이면 'offline'으로 변경
      if (diffMinutes >= offlineMinutes && device.status === Status.ONLINE) {
        this.logger.log(`디바이스 ${device.id}를 offline으로 변경합니다.`);
        const deviceIndex = await this.dbService.db.getIndex(
          '/devices',
          device.id,
          'id',
        );
        await this.dbService.db.push(
          `/devices[${deviceIndex}]/status`,
          Status.OFFLINE,
        );
      }
    }

    // 2. 만료된 명령 처리
    const pendingCommands = await this.dbService.db.filter<Command>(
      '/commands',
      (cmd) => cmd.status === Status.PENDING,
    );
    for (const command of pendingCommands ?? []) {
      const createdAt = new Date(command.createdAt);
      // 현재 시간과 명령 생성 시간의 차이(분)를 계산
      const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

      // 차이가 2분 이상이면 'expired'로 변경
      if (diffMinutes >= expireMinutes) {
        this.logger.log(`명령 ${command.id}를 expired로 변경합니다.`);
        const commandIndex = await this.dbService.db.getIndex(
          '/commands',
          command.id,
          'id',
        );
        await this.dbService.db.push(
          `/commands[${commandIndex}]/status`,
          Status.EXPIRED,
        );
      }
    }

    this.logger.debug('배치 작업을 완료했습니다.');
  }
}
