import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonDB, Config } from 'node-json-db';

@Injectable()
export class DatabaseService implements OnModuleInit {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config(process.env.DB_FILENAME!, true, true, '/'));
  }

  // 모듈이 초기화될 때 실행되는 메서드
  async onModuleInit() {
    if (!(await this.db.exists('/devices'))) {
      await this.db.push('/devices', []);
    }
    if (!(await this.db.exists('/commands'))) {
      await this.db.push('/commands', []);
    }
    console.log('Database initialized successfully.');
  }
}
