// 제어 명령의 종류를 정의하는 열거형(Enum)입니다.
export enum CommandType {
  POWER = 'power',
  TEMPERATURE = 'temperature',
  MODE = 'mode',
  FAN_SPEED = 'fanSpeed',
  TIMER = 'timer',
}

// 전원(power) 명령의 값들을 정의합니다.
export enum PowerValue {
  ON = 'on',
  OFF = 'off',
}
