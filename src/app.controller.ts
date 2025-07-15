/**
 * NestJS 프로젝트가 처음 생성될 때 만들어지는 가장 기본적인 컨트롤러이다.
 * 애플리케이션의 root 경로(/) 로 들어오는 요청을 처리하며, 서버가 정상적으로 실행 중인지 확인하는 헬스체크 엔드포인트 역할을 한다.
 * 실제 로직은 다른 기능별 controller 들이 담당한다.
 */

// NestJS에서 컨트롤러와 HTTP GET 요청을 처리하기 위한 데코레이터를 가져옵니다.
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// @Controller() 데코레이터는 이 클래스가 컨트롤러임을 나타냅니다.
// 괄호 안이 비어있으면, 이 컨트롤러는 애플리케이션의 루트 경로('/')에 대한 요청을 담당합니다.
@Controller()
export class AppController {
  // 생성자를 통해 AppService를 주입(Dependency Injection)받습니다.
  // private readonly 키워드는 appService를 이 클래스 내에서만 사용할 수 있는 읽기 전용 속성으로 만들어줍니다.
  constructor(private readonly appService: AppService) {}

  // @Get() 데코레이터는 HTTP GET 요청을 처리하는 메소드임을 나타냅니다.
  // 이 메소드는 GET 요청이 '/' 경로로 들어왔을 때 실행됩니다.
  @Get()
  // getHello라는 이름의 메소드를 정의하며, 반환 타입은 문자열(string)입니다.
  getHello(): string {
    // 주입받은 appService의 getHello() 메소드를 호출하고, 그 결과를 반환합니다.
    return this.appService.getHello();
  }
}
