/**
 * /commands 경로로 들어오는 HTTP 요청을 처리하는 컨트롤러
 */

import { Controller, Post, Body } from '@nestjs/common'; // NestJS에서 컨트롤러, POST 요청, 요청 Body 처리에 필요한 데코레이터
import { ApiOperation, ApiResponse } from '@nestjs/swagger'; // Swagger 문서화를 위한 데코레이터
import { CommandsService } from './commands.service'; // 비즈니스 로직을 처리할 CommandsService
import { CreateCommandDto } from './dto/create-command.dto';

// @Controller('commands') 데코레이터는 이 클래스가 '/commands' 경로로 들어오는 요청을 처리함을 나타냅니다.
@Controller('commands')
export class CommandsController {
  // 생성자를 통해 CommandsService를 주입(Dependency Injection)받습니다.
  constructor(private readonly commandsService: CommandsService) {}

  // @ApiOperation 데코레이터는 Swagger 문서에 이 API의 제목과 설명을 추가합니다.
  @ApiOperation({
    summary: '에어컨 제어 명령 등록',
    description: '새로운 제어 명령을 생성하여 DB에 저장합니다.',
  })
  // @ApiResponse 데코레이터는 이 API가 반환할 수 있는 응답의 상태 코드와 설명을 문서화합니다.
  @ApiResponse({
    status: 201, // 201 Created: 성공적으로 리소스가 생성되었을 때의 상태 코드
    description: '명령이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: 400, // 400 Bad Request: 클라이언트의 요청이 잘못되었을 때의 상태 코드
    description: '요청 본문(body)의 형식이 유효하지 않습니다.',
  })
  // @Post() 데코레이터는 이 메소드가 HTTP POST 요청을 처리함을 나타냅니다.
  // 이 메소드는 POST /commands 경로로 요청이 들어왔을 때 실행됩니다.
  @Post()
  // create 메소드를 정의합니다. create 라는 이름은 단순히 개발자의 가독성을 위한 것으로, 다른 이름으로 지어도 관련없음.
  // @Body() 데코레이터는 요청의 body 내용을 createCommandDto 파라미터에 할당합니다.
  // createCommandDto의 타입이 CreateCommandDto로 지정되어 있어, ValidationPipe가 자동으로 유효성을 검증합니다.
  create(@Body() createCommandDto: CreateCommandDto) {
    // 주입받은 commandsService의 create 메소드를 호출하고, DTO를 인자로 전달합니다.
    // 서비스에서 처리된 결과를 그대로 클라이언트에게 반환(return)합니다.
    return this.commandsService.create(createCommandDto);
  }
}
