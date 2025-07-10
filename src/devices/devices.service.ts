import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Command } from '../commands/command.interface';
import { Status } from 'src/common/common.enums';

@Injectable()
export class DevicesService {
  constructor(private readonly dbService: DatabaseService) {}

  async pollCommands(deviceId: string) {
    // 1. DB에서 해당 deviceId를 가진 디바이스를 찾는다
    const deviceIndex = await this.dbService.db.getIndex(
      '/devices',
      deviceId,
      'id',
    );

    // 만약 디바이스가 존재하지 않으면 새로운 디바이스 정보를 생성하여 DB에 추가
    if (deviceIndex === -1) {
      await this.dbService.db.push('/devices[]', {
        id: deviceId,
        status: 'online', // 최초 상태는 online
        lastPingAt: new Date().toISOString(),
        currentStat: {}, // 현재 상태는 비어있음
      });
    } else {
      // 디바이스가 존재하면, 상태와 마지막 통신 시간을 업데이트한다
      await this.dbService.db.push(
        `/devices[${deviceIndex}]/status`,
        Status.ONLINE,
      );
      await this.dbService.db.push(
        `/devices[${deviceIndex}]/lastPingAt`,
        new Date().toISOString(),
      );
    }

    // 2. 처리할 'pending' 상태의 명령 찾기
    // DB의 모든 명령들 중에서 deviceId가 일치하고 status가 'pending'인 첫 번째 명령을 찾는다
    const commandToProcess = await this.dbService.db.find<Command>(
      '/commands',
      (cmd) => cmd.deviceId === deviceId && cmd.status === Status.PENDING,
    );

    // 만약 처리할 명령이 있다면, 명령의 상태를 'in-progress'(처리 중)으로 변경
    if (commandToProcess) {
      const commandIndex = await this.dbService.db.getIndex(
        '/commands',
        commandToProcess.id,
        'id',
      );

      await this.dbService.db.push(
        `/commands[${commandIndex}]/status`,
        Status.IN_PROGRESS,
      );
    }

    // 처리할 명령을 반환. 없으면 undefined가 반환됨
    return commandToProcess;
  }
}
