import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';

@Injectable()
export class DatabaseService implements OnModuleInit {
  db: JsonDB;

  constructor() {
    // 'myData.json' 이라는 이름의 파일로 DB를 설정합니다.
    this.db = new JsonDB(new Config('myData', true, true, '/'));
  }

  // 모듈이 초기화될 때 실행되는 메서드
  async onModuleInit() {
    // DB에 devices와 commands 테이블(배열)이 없으면 생성합니다.
    if (!(await this.db.exists('/devices'))) {
      await this.db.push('/devices', []);
    }
    if (!(await this.db.exists('/commands'))) {
      await this.db.push('/commands', []);
    }
    console.log('Database initialized successfully.');
  }
}
