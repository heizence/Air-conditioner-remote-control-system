import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from './devices.service';
import { DatabaseService } from '../database/database.service';
import { Command } from '../commands/interfaces/command.interface';
import { Status } from '../common/common.enums';

const mockDatabaseService = {
  db: {
    getIndex: jest.fn(),
    push: jest.fn(),
    find: jest.fn(),
  },
};

describe('DevicesService', () => {
  let service: DevicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
    jest.clearAllMocks();
  });

  describe('pollCommands', () => {
    it('새로운 디바이스가 폴링하면, 디바이스를 생성하고 online 상태로 만들어야 한다', async () => {
      // given: DB에 해당 디바이스가 없는 상황 (-1 반환)
      mockDatabaseService.db.getIndex.mockResolvedValue(-1);
      mockDatabaseService.db.find.mockResolvedValue(undefined); // 처리할 명령은 없음
      const deviceId = 'new-device';

      // when: pollCommands를 호출
      await service.pollCommands(deviceId);

      // then: DB에 새로운 디바이스 정보가 저장(push)되었는지 확인한다.
      expect(mockDatabaseService.db.push).toHaveBeenCalledWith(
        '/devices[]',
        expect.objectContaining({
          id: deviceId,
          status: Status.ONLINE,
        }),
      );
    });

    it('처리할 명령이 있으면, 해당 명령을 in-progress로 변경하고 반환해야 한다', async () => {
      // given: 기존 디바이스가 존재하고, 처리할 명령이 있는 상황
      const pendingCommand: Command = {
        id: 'cmd-1',
        deviceId: 'existing-device',
        status: Status.PENDING,
      } as Command;
      mockDatabaseService.db.getIndex.mockResolvedValue(0); // 디바이스 인덱스 0
      mockDatabaseService.db.find.mockResolvedValue(pendingCommand);
      mockDatabaseService.db.getIndex
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0); // 디바이스, 커맨드 인덱스

      const deviceId = 'existing-device';

      // when: pollCommands를 호출합니다.
      const result = await service.pollCommands(deviceId);

      // then: 명령의 상태가 'in-progress'로 업데이트 되었는지 확인한다.
      expect(mockDatabaseService.db.push).toHaveBeenCalledWith(
        '/commands[0]/status',
        Status.IN_PROGRESS,
      );
      // 반환된 결과가 주어진 명령과 같은지 확인한다.
      expect(result).toEqual(pendingCommand);
    });
  });
});
