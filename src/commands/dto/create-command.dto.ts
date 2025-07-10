import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { CommandType } from '../command.enums';

export class CreateCommandDto {
  @ApiProperty({
    description: '제어 대상 디바이스의 고유 ID',
    example: 'device-001',
  })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({
    description: '제어할 명령의 종류',
    example: CommandType.TEMPERATURE,
    enum: CommandType,
  })
  @IsIn(Object.values(CommandType))
  type: CommandType;

  @ApiProperty({
    description: "명령에 해당하는 값 (예: 'on', 25, 'cool')",
    example: 25,
  })
  @IsNotEmpty()
  value: any;
}
