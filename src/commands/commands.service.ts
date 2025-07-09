// src/commands/commands.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { v4 as uuidv4 } from 'uuid';
import { Command } from './command.interface';
import { CommandType, PowerValue } from './command.enum';
import { Status } from 'src/common/common.enums';

@Injectable()
export class CommandsService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createCommandDto: CreateCommandDto) {
    // DTO에서 deviceId, type, value 속성을 직접 추출합니다.
    const { deviceId, type, value } = createCommandDto;

    // 1. 명령 '값(value)'에 대한 세부 유효성 검사
    this.validateCommandValue(type, value);

    // 2. 동일한 명령 중복 등록 검사
    const pendingCommands = await this.dbService.db.filter<Command>(
      '/commands',
      (cmd: Command) => cmd.status === Status.PENDING,
    );
    const isDuplicate = (pendingCommands ?? []).some(
      (cmd) =>
        cmd.deviceId === deviceId && cmd.type === type && cmd.value === value,
    );
    if (isDuplicate) {
      throw new BadRequestException('동일한 명령이 이미 등록 대기 중입니다.');
    }

    const newCommand = {
      id: uuidv4(),
      deviceId,
      type,
      value,
      status: Status.PENDING,
      retryCount: 0,
      createdAt: new Date().toISOString(),
    };

    await this.dbService.db.push('/commands[]', newCommand, true);
    return newCommand;
  }

  private validateCommandValue(type: CommandType, value: any) {
    switch (type) {
      case CommandType.POWER:
        if (value !== PowerValue.ON && value !== PowerValue.OFF) {
          throw new BadRequestException('power 값은 on 또는 off만 가능합니다.');
        }
        break;

      case CommandType.TEMPERATURE:
        if (!Number.isInteger(value) || value < 16 || value > 30) {
          throw new BadRequestException(
            'temperature 값은 16에서 30 사이의 정수여야 합니다.',
          );
        }
        break;
    }
  }
}
