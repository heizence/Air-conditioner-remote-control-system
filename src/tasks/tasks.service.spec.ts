import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { DatabaseService } from '../database/database.service';
import { ConfigService } from '@nestjs/config';
import { Device } from '../devices/interfaces/device.interface';
import { Command } from '../commands/interfaces/command.interface';
import { Status } from '../common/common.enums';

const mockDatabaseService = {
  db: {
    getData: jest.fn(),
    filter: jest.fn(),
    getIndex: jest.fn(),
    push: jest.fn(),
  },
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    // 키에 따라 다른 설정 값을 반환
    if (key === 'DEVICE_OFFLINE_MINUTES') return 5;
    if (key === 'COMMAND_EXPIRE_MINUTES') return 2;
    return null;
  }),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  describe('handleCron', () => {
    // 테스트에서 사용할 기준 시간
    const MOCK_SYSTEM_TIME = new Date('2025-07-10T12:00:00Z');

    // 각 테스트가 실행되기 전에, 시스템 시간을 MOCK_SYSTEM_TIME으로 고정한다.
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(MOCK_SYSTEM_TIME);
    });

    it('마지막 통신 후 5분이 지난 디바이스를 offline으로 변경해야 한다', async () => {
      // given: 고정된 시간(MOCK_SYSTEM_TIME)보다 정확히 6분 전에 통신한 디바이스
      const lastPingTime = new Date(MOCK_SYSTEM_TIME.getTime() - 6 * 60 * 1000);
      const oldDevice: Device = {
        id: 'old-device',
        status: Status.ONLINE,
        lastPingAt: lastPingTime.toISOString(),
      } as Device;
      mockDatabaseService.db.getData.mockResolvedValue([oldDevice]);
      mockDatabaseService.db.filter.mockResolvedValue([]); // 만료될 명령은 없음
      mockDatabaseService.db.getIndex.mockResolvedValue(0);

      // when: 배치 작업을 실행
      await service.handleCron();

      // then: 디바이스의 상태가 'offline'으로 변경되었는지 확인한다.
      expect(mockDatabaseService.db.push).toHaveBeenCalledWith(
        '/devices[0]/status',
        Status.OFFLINE,
      );
    });

    it('생성 후 2분이 지난 명령을 expired로 변경해야 한다', async () => {
      // given: 고정된 시간(MOCK_SYSTEM_TIME)보다 정확히 3분 전에 생성된 명령
      const createdAtTime = new Date(
        MOCK_SYSTEM_TIME.getTime() - 3 * 60 * 1000,
      );
      const oldCommand: Command = {
        id: 'old-cmd',
        status: Status.PENDING,
        createdAt: createdAtTime.toISOString(),
      } as Command;
      mockDatabaseService.db.getData.mockResolvedValue([]); // 오프라인될 디바이스는 없음
      mockDatabaseService.db.filter.mockResolvedValue([oldCommand]);
      mockDatabaseService.db.getIndex.mockResolvedValue(0);

      // when: 배치 작업을 실행한다.
      await service.handleCron();

      // then: 명령의 상태가 'expired'로 변경되었는지 확인한다.
      expect(mockDatabaseService.db.push).toHaveBeenCalledWith(
        '/commands[0]/status',
        'expired',
      );
    });
  });
});
