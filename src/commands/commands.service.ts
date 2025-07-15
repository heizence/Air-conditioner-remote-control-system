/**
 * 명령 생성 시 필요한 유효성 검사, 중복 확인 등 실제 비즈니스 로직을 수행합니다.
 */
import { Injectable, BadRequestException } from '@nestjs/common'; // NestJS에서 필요한 Injectable 데코레이터와 에러 처리를 위한 클래스
import { DatabaseService } from '../database/database.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { v4 as uuidv4 } from 'uuid';
import { Command } from './interfaces/command.interface';
import { CommandType, PowerValue } from './command.enums';
import { Status } from '../common/common.enums';

// @Injectable() 데코레이터는 이 클래스가 NestJS의 Provider임을 나타냅니다.
@Injectable()
export class CommandsService {
  // 생성자를 통해 DatabaseService를 주입받습니다.
  constructor(private readonly dbService: DatabaseService) {}

  // 새로운 명령을 생성하는 비동기 메소드
  async create(createCommandDto: CreateCommandDto) {
    const { deviceId, type, value } = createCommandDto;

    // 1. 명령 '값(value)'에 대한 세부 유효성 검사를 위해 private 메소드를 호출합니다.
    this.validateCommandValue(type, value);

    // 2. 동일한 명령이 중복 등록되는 것을 방지하기 위한 로직입니다.
    // DB에서 status가 'pending'인 모든 명령들을 가져옵니다.
    const pendingCommands = await this.dbService.db.filter<Command>(
      '/commands',
      (cmd: Command) => cmd.status === Status.PENDING,
    );
    // pendingCommands가 null이나 undefined일 경우 빈 배열([])로 처리하고,
    // 그 안에서 현재 요청과 동일한 내용의 명령이 있는지 확인합니다.
    const isDuplicate = (pendingCommands ?? []).some(
      (cmd) =>
        cmd.deviceId === deviceId && cmd.type === type && cmd.value === value,
    );
    // 만약 중복된 명령이 있다면, 400 에러를 발생시켜 처리를 중단합니다.
    if (isDuplicate) {
      throw new BadRequestException('동일한 명령이 이미 등록 대기 중입니다.');
    }

    // DB에 저장할 새로운 명령 객체를 생성합니다.
    const newCommand = {
      id: uuidv4(), // 고유한 ID를 생성하여 할당합니다.
      deviceId, // 요청받은 deviceId
      type, // 요청받은 type
      value, // 요청받은 value
      status: Status.PENDING, // 초기 상태는 'pending'으로 설정합니다.
      retryCount: 0, // 재시도 횟수는 0으로 초기화합니다.
      createdAt: new Date().toISOString(), // 현재 시간을 UTC 기준으로 생성 시간을 기록합니다.
    };

    // 생성된 명령 객체를 DB의 '/commands' 배열의 맨 뒤에 추가합니다.
    await this.dbService.db.push('/commands[]', newCommand, true);
    // 생성된 명령 객체를 컨트롤러에 반환합니다.
    return newCommand;
  }

  // 명령 타입에 따라 값의 유효성을 검증하는 private 헬퍼 메소드입니다.
  private validateCommandValue(type: CommandType, value: any) {
    // 명령 타입(type)에 따라 다른 검증 로직을 실행합니다.
    switch (type) {
      // 타입이 'POWER'일 경우
      case CommandType.POWER:
        // 값이 'on'도 아니고 'off'도 아니면 에러를 발생시킵니다.
        if (value !== PowerValue.ON && value !== PowerValue.OFF) {
          throw new BadRequestException('power 값은 on 또는 off만 가능합니다.');
        }
        break;

      // 타입이 'TEMPERATURE'일 경우
      case CommandType.TEMPERATURE:
        // 값이 정수가 아니거나, 16보다 작거나, 30보다 크면 에러를 발생시킵니다.
        if (!Number.isInteger(value) || value < 16 || value > 30) {
          throw new BadRequestException(
            'temperature 값은 16에서 30 사이의 정수여야 합니다.',
          );
        }
        break;
    }
  }
}
