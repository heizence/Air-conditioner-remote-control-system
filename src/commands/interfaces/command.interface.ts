/**
 * Command 객체의 타입을 정의하여 타입스크립트의 타입 안정성을 활용한다.
 */
import { Status } from 'src/common/common.enums';
import { CommandType } from '../command.enums';

export interface Command {
  id: string;
  deviceId: string;
  type: CommandType;
  value: any;
  status: Status;
  retryCount: number;
  createdAt: string;
}
