/**
 * node-json-db 라이브러리를 직접 제어하고, DB 연결 및 초기 데이터 생성을 책임지는 서비스 파일이다.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';

// @Injectable() 데코레이터는 이 클래스가 NestJS의 의존성 주입 시스템에 의해 관리될 수 있는 Provider임을 나타냅니다.
@Injectable()
// OnModuleInit 인터페이스를 구현하여, 모듈 초기화 시점에 특정 로직을 실행하도록 합니다.
export class DatabaseService implements OnModuleInit {
  db: JsonDB; // JsonDB 클라이언트 인스턴스를 저장할 db 속성을 선언합니다.

  constructor() {
    // JsonDB의 설정 객체(Config)를 생성하고, 이를 기반으로 JsonDB 인스턴스를 생성하여 this.db에 할당합니다.
    // process.env.DB_FILENAME!: .env 파일에 정의된 DB 파일 이름을 가져옵니다. '!'는 이 값이 null이나 undefined가 아님을 타입스크립트에게 알려줍니다.
    // 첫 번째 true: push 메소드 호출 시 자동으로 파일에 저장(saveOnPush)합니다.
    // 두 번째 true: JSON 파일을 사람이 읽기 쉬운 형태(humanReadable)로 저장합니다.
    // '/': 데이터 경로의 구분자로 '/'를 사용합니다.
    this.db = new JsonDB(new Config(process.env.DB_FILENAME!, true, true, '/'));
  }

  // OnModuleInit 인터페이스의 요구사항으로, 모듈이 초기화된 후 NestJS에 의해 자동으로 호출되는 메소드입니다.
  async onModuleInit() {
    // 데이터베이스 내부에 '/devices' 경로가 존재하는지 비동기적으로 확인합니다.
    if (!(await this.db.exists('/devices'))) {
      // 만약 '/devices' 경로가 없다면, 해당 경로를 생성하고 빈 배열([])로 초기화합니다.
      await this.db.push('/devices', []);
    }
    // 데이터베이스 내부에 '/commands' 경로가 존재하는지 비동기적으로 확인합니다.
    if (!(await this.db.exists('/commands'))) {
      // 만약 '/commands' 경로가 없다면, 해당 경로를 생성하고 빈 배열([])로 초기화합니다.
      await this.db.push('/commands', []);
    }
    console.log('Database initialized successfully.');
  }
}
