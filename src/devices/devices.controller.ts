/**
 * /device 경로의 API, 즉 디바이스가 명령을 가져가는 폴링 요청을 처리한다.
 */
import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// @Controller('devices') 데코레이터는 이 클래스가 '/devices' 경로로 들어오는 요청을 처리함을 나타낸다.
@Controller('devices')
// 이 컨트롤러에 있는 모든 API들은 Swagger UI에서 'Devices API'라는 그룹에 속하게 됩니다.
@ApiTags('Devices API')
export class DevicesController {
  // 생성자를 통해 DevicesService 를 주입(Dependency Injection)받습니다.
  constructor(private readonly devicesService: DevicesService) {}

  // @ApiOperation 데코레이터는 Swagger 문서에 이 API 의 제목과 설명을 추가합니다.
  @ApiOperation({
    summary: '디바이스의 제어 명령 폴링',
    description: '디바이스가 처리할 새로운 명령을 가져갑니다.',
  })
  // @ApiResponse 데코레이터는 이 API 가 반환할 수 있는 응답의 상태 코드와 설명을 문서화합니다.
  @ApiResponse({
    status: 200,
    description: '처리할 명령을 반환합니다. (없으면 null)',
  })

  // @Get() 데코레이터는 이 메소드가 HTTP GET 요청을 처리함을 나타냅니다.
  // ':deviceId/commands'는 동적인 경로를 정의합니다.
  // 예를 들어, /devices/device-001/commands 와 같은 형식의 URL 요청을 처리하게 됩니다.
  @Get(':deviceId/commands')
  pollCommands(@Param('deviceId') deviceId: string) {
    // 주입받은 devicesService의 pollCommands 메소드를 호출하고, URL에서 추출한 deviceId를 인자로 전달합니다.
    // 서비스에서 처리된 결과(예: 처리할 명령 객체 또는 null)가 클라이언트에게 반환됩니다.
    return this.devicesService.pollCommands(deviceId);
  }
}
