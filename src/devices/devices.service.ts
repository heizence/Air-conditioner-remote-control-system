import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Command } from '../commands/interfaces/command.interface';
import { Status } from '../common/common.enums';

// @Injectable() 데코레이터는 이 클래스가 NestJS의 Provider임을 나타냅니다.
@Injectable()
export class DevicesService {
  // 생성자를 통해 DatabaseService를 주입받아, 이 클래스 내에서 DB 관련 작업을 수행할 수 있게 합니다.
  constructor(private readonly dbService: DatabaseService) {}

  // 디바이스가 새로운 명령을 요청(폴링)할 때 호출되는 비동기 메소드입니다.
  async pollCommands(deviceId: string) {
    // 1. DB의 '/devices' 경로에서, 'id' 속성값이 주어진 deviceId와 일치하는 데이터의 인덱스를 찾습니다.
    const deviceIndex = await this.dbService.db.getIndex(
      '/devices',
      deviceId,
      'id',
    );

    // deviceIndex가 -1이라는 것은, 해당 deviceId를 가진 디바이스가 DB에 존재하지 않음을 의미합니다.
    if (deviceIndex === -1) {
      // 새로운 디바이스이므로, 해당 디바이스 정보를 생성하여 '/devices' 배열에 추가합니다.
      await this.dbService.db.push('/devices[]', {
        id: deviceId, // 디바이스 ID
        status: Status.ONLINE, // 최초 상태는 'online'으로 설정합니다.
        lastPingAt: new Date().toISOString(), // 마지막 통신 시간을 현재 시간으로 기록합니다.
        currentStat: {}, // 현재 에어컨 상태 정보는 비어있는 객체로 초기화합니다.
      });
    } else {
      // 이미 존재하는 디바이스이므로, 상태를 'online'으로 업데이트합니다.
      await this.dbService.db.push(
        `/devices[${deviceIndex}]/status`, // 예: /devices[0]/status
        Status.ONLINE,
      );
      // 마지막 통신 시간(lastPingAt)을 현재 시간으로 갱신합니다.
      await this.dbService.db.push(
        `/devices[${deviceIndex}]/lastPingAt`, // 예: /devices[0]/lastPingAt
        new Date().toISOString(),
      );
    }

    // 2. 이 디바이스가 처리해야 할 'pending' 상태의 명령을 찾습니다.
    // DB의 '/commands' 경로에서, 조건에 맞는 첫 번째 데이터를 찾습니다.
    const commandToProcess = await this.dbService.db.find<Command>(
      '/commands',
      // 조건: deviceId가 일치하고, status가 'PENDING'이어야 함
      (cmd) => cmd.deviceId === deviceId && cmd.status === Status.PENDING,
    );

    // 만약 처리할 명령(commandToProcess)을 찾았다면,
    if (commandToProcess) {
      // 해당 명령의 인덱스를 DB에서 찾습니다.
      const commandIndex = await this.dbService.db.getIndex(
        '/commands',
        commandToProcess.id,
        'id',
      );

      // 찾은 인덱스를 이용하여 해당 명령의 상태(status)를 'IN_PROGRESS'(처리 중)로 업데이트합니다.
      await this.dbService.db.push(
        `/commands[${commandIndex}]/status`,
        Status.IN_PROGRESS,
      );
    }

    // 처리할 명령 객체를 컨트롤러에 반환합니다. 만약 처리할 명령이 없었다면 undefined가 반환됩니다.
    return commandToProcess;
  }
}
