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
