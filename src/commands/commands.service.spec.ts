import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { DatabaseService } from '../database/database.service';
import { BadRequestException } from '@nestjs/common';
import { CommandType, PowerValue } from './command.enums';
import { Command } from './interfaces/command.interface';
import { Status } from '../common/common.enums';

const mockDatabaseService = {
  db: {
    filter: jest.fn(), // filter 메소드를 모킹
    push: jest.fn(), // push 메소드를 모킹
  },
};

describe('CommandsService', () => {
  let service: CommandsService;

  // 각 테스트가 실행되기 전에 모듈을 설정
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService, // 실제 DB 서비스 대신 가짜 서비스를 사용
        },
      ],
    }).compile();

    service = module.get<CommandsService>(CommandsService);

    // 각 테스트 전에 mock 함수들의 상태를 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('유효한 power 명령어를 성공적으로 생성해야 한다', async () => {
      // given: 중복된 명령이 없는 상황을 가정한다.
      mockDatabaseService.db.filter.mockResolvedValue([]);
      const dto = {
        deviceId: 'device-1',
        type: CommandType.POWER,
        value: PowerValue.ON,
      };

      // when: create 메소드를 호출
      const result = await service.create(dto);

      // then: 결과가 예상대로이고, DB에 데이터가 저장(push)되었는지 확인한다.
      expect(result.deviceId).toBe(dto.deviceId);
      expect(result.status).toBe('pending');
      expect(mockDatabaseService.db.push).toHaveBeenCalledTimes(1);
    });

    it('허용 범위를 벗어난 온도로 생성 시 BadRequestException을 던져야 한다', async () => {
      // given: 온도가 31도인 잘못된 요청
      const dto = {
        deviceId: 'device-1',
        type: CommandType.TEMPERATURE,
        value: 31,
      };

      // when & then: create 메소드 호출 시 에러가 발생하는지 확인한다.
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('이미 대기 중인 동일한 명령어를 중복 생성하면 BadRequestException을 던져야 한다', async () => {
      // given: DB에 동일한 pending 명령이 있는 상황을 가정한다.
      const duplicateCommand: Partial<Command> = {
        deviceId: 'device-1',
        type: CommandType.POWER,
        value: PowerValue.ON,
        status: Status.PENDING,
      };
      mockDatabaseService.db.filter.mockResolvedValue([duplicateCommand]);
      const dto = {
        deviceId: 'device-1',
        type: CommandType.POWER,
        value: PowerValue.ON,
      };

      // when & then: create 메소드 호출 시 에러가 발생하는지 확인한다.
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      // DB에 새로운 데이터가 저장되지 않았는지 확인한다.
      expect(mockDatabaseService.db.push).not.toHaveBeenCalled();
    });
  });
});
