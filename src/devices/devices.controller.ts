import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Devices API')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @ApiOperation({
    summary: '디바이스의 제어 명령 폴링',
    description: '디바이스가 처리할 새로운 명령을 가져갑니다.',
  })
  @ApiResponse({
    status: 200,
    description: '처리할 명령을 반환합니다. (없으면 null)',
  })
  @Get(':deviceId/commands')
  pollCommands(@Param('deviceId') deviceId: string) {
    // 서비스의 pollCommands 메소드를 호출하여 로직을 처리
    return this.devicesService.pollCommands(deviceId);
  }
}
