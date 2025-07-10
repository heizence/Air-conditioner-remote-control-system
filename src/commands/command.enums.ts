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
