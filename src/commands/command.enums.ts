/**
 * 주요 변수를 enum 으로 관리하여 코드의 오타를 방지하고 가독성을 높인다.
 */

// 제어 명령의 종류를 정의하는 값
export enum CommandType {
  POWER = 'power',
  TEMPERATURE = 'temperature',
  MODE = 'mode',
  FAN_SPEED = 'fanSpeed',
  TIMER = 'timer',
}

// 전원(power) 명령 값
export enum PowerValue {
  ON = 'on',
  OFF = 'off',
}
