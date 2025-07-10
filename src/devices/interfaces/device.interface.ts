import { Status } from 'src/common/common.enums';

export interface Device {
  id: string;
  status: Status; // 디바이스의 통신 상태 ('online' 또는 'offline')
  lastPingAt: string; // 마지막으로 서버와 통신한 시간 (ISO 8601 형식의 문자열)
  currentStat: Record<string, any>; // 디바이스의 현재 상태 정보 (전원, 온도, 모드 등)
}
