// Controller, Get, Param 데코레이터를 가져옵니다.
import { Controller, Get, Param } from '@nestjs/common';
// DevicesService를 가져옵니다.
import { DevicesService } from './devices.service';
// Swagger 데코레이터를 가져옵니다.
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// '/devices' 경로로 컨트롤러를 그룹화하고, Swagger 태그를 추가합니다.
@ApiTags('Devices API')
@Controller('devices')
export class DevicesController {
  // 생성자를 통해 DevicesService를 주입받습니다.
  constructor(private readonly devicesService: DevicesService) {}

  // Swagger 문서에 API 정보를 추가합니다.
  @ApiOperation({
    summary: '디바이스의 제어 명령 폴링',
    description: '디바이스가 처리할 새로운 명령을 가져갑니다.',
  })
  @ApiResponse({
    status: 200,
    description: '처리할 명령을 반환합니다. (없으면 null)',
  })
  // GET /devices/{deviceId}/commands 경로의 GET 요청을 처리합니다.
  @Get(':deviceId/commands')
  // 경로 파라미터로 deviceId를 받습니다.
  pollCommands(@Param('deviceId') deviceId: string) {
    // 서비스의 pollCommands 메소드를 호출하여 로직을 처리합니다.
    return this.devicesService.pollCommands(deviceId);
  }
}
