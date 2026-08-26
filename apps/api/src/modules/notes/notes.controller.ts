import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteResponseDto } from './mapper/note.mapper';
import { NotesService } from './notes.service';

@ApiTags('notes')
@ApiBearerAuth('access-token')
@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('properties/:id/notes')
  @ApiOperation({ summary: 'Create a private note on a property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: NoteResponseDto })
  create(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(user.sub, id, dto);
  }

  @Get('notes')
  @ApiOperation({ summary: 'List current user property notes' })
  @ApiOkResponse({ type: [NoteResponseDto] })
  list(@CurrentUser() user: AuthUserPayload) {
    return this.notesService.list(user.sub);
  }

  @Patch('notes/:id')
  @ApiOperation({ summary: 'Update a note owned by the current user' })
  @ApiParam({ name: 'id', description: 'Note id' })
  @ApiOkResponse({ type: NoteResponseDto })
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(user.sub, id, dto);
  }

  @Delete('notes/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a note owned by the current user' })
  @ApiParam({ name: 'id', description: 'Note id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.notesService.remove(user.sub, id);
  }
}
