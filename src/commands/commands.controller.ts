import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @ApiOperation({
    summary: '에어컨 제어 명령 등록',
    description: '새로운 제어 명령을 생성하여 DB에 저장합니다.',
  })
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
