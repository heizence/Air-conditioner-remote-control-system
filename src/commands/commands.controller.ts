// src/commands/commands.controller.ts

// Controller, Post, Body 외에 ApiOperation, ApiResponse를 가져옵니다.
import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  // @ApiOperation 데코레이터로 이 API가 어떤 작업을 하는지 요약 설명을 추가합니다.
  @ApiOperation({
    summary: '에어컨 제어 명령 등록',
    description: '새로운 제어 명령을 생성하여 DB에 저장합니다.',
  })
  // @ApiResponse 데코레이터로 예상되는 응답 상태 코드와 설명을 추가합니다.
  @ApiResponse({
    status: 201,
    description: '명령이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({
    status: 400,
    description: '요청 본문(body)의 형식이 유효하지 않습니다.',
  })
  @Post()
  create(@Body() createCommandDto: CreateCommandDto) {
    return this.commandsService.create(createCommandDto);
  }
}
