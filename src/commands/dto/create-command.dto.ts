// src/commands/dto/create-command.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty } from 'class-validator';
// 1. CommandType enum을 가져옵니다.
import { CommandType } from '../command.enum';

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
    example: CommandType.TEMPERATURE, // 예시도 enum 값으로 변경
    enum: CommandType, // Swagger 문서에 enum 타입임을 명시
  })
  // 2. @IsIn 데코레이터가 하드코딩된 배열 대신 enum의 값들을 사용하도록 변경합니다.
  @IsIn(Object.values(CommandType))
  // 3. type 속성의 타입도 CommandType enum으로 변경합니다.
  type: CommandType;

  @ApiProperty({
    description: "명령에 해당하는 값 (예: 'on', 25, 'cool')",
    example: 25,
  })
  @IsNotEmpty()
  value: any;
}
