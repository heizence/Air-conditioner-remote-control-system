/**
 * command 생성 요청(Request Body)의 데이터 구조를 정의한다.
 * class-validator 를 통해 기본적인 유효성 검사 규칙을 명시한다.
 */

import { ApiProperty } from '@nestjs/swagger'; // Swagger 문서화를 위한 ApiProperty 데코레이터
import { IsString, IsIn, IsNotEmpty } from 'class-validator'; // 데이터 유효성 검증을 위한 데코레이터
import { CommandType } from '../command.enums';

// 'command 생성' 요청의 Body 데이터 구조를 정의하는 클래스입니다.
export class CreateCommandDto {
  // @ApiProperty 데코레이터는 Swagger 문서에 이 속성에 대한 설명과 예시를 추가합니다.
  @ApiProperty({
    description: '제어 대상 디바이스의 고유 ID',
    example: 'device-001',
  })
  // @IsString() 데코레이터는 이 속성의 값이 반드시 문자열이어야 함을 검증합니다.
  @IsString()
  // @IsNotEmpty() 데코레이터는 이 속성의 값이 비어있지 않아야 함을 검증합니다.
  @IsNotEmpty()
  deviceId: string; // deviceId 속성을 문자열 타입으로 선언합니다.

  // Swagger 문서에 이 속성이 enum 타입임을 명시하고, 설명과 예시를 추가합니다.
  @ApiProperty({
    description: '제어할 명령의 종류',
    example: CommandType.TEMPERATURE,
    enum: CommandType,
  })
  // @IsIn() 데코레이터는 이 속성의 값이 CommandType enum에 정의된 값들 중 하나여야 함을 검증합니다.
  // Object.values(CommandType)는 ['power', 'temperature', ...] 와 같은 배열을 반환합니다.
  @IsIn(Object.values(CommandType))
  // type 속성을 CommandType enum 타입으로 선언합니다.
  type: CommandType;

  // Swagger 문서에 이 속성에 대한 설명과 예시를 추가합니다.
  @ApiProperty({
    description: "명령에 해당하는 값 (예: 'on', 25, 'cool')",
    example: 25,
  })
  // @IsNotEmpty() 데코레이터는 이 속성의 값이 비어있지 않아야 함을 검증합니다.
  @IsNotEmpty()
  // value 속성을 any 타입으로 선언합니다.
  // 'type'에 따라 값의 유효성 규칙이 달라지므로, 세부적인 검증은 서비스 계층에서 처리합니다.
  value: any;
}
