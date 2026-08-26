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
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertResponseDto } from './mapper/alert.mapper';

@ApiTags('alerts')
@ApiBearerAuth('access-token')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a saved search alert' })
  @ApiOkResponse({ type: AlertResponseDto })
  create(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateAlertDto,
  ) {
    return this.alertsService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List current user saved search alerts' })
  @ApiOkResponse({ type: [AlertResponseDto] })
  list(@CurrentUser() user: AuthUserPayload) {
    return this.alertsService.list(user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a saved search alert' })
  @ApiParam({ name: 'id', description: 'Alert id' })
  @ApiOkResponse({ type: AlertResponseDto })
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateAlertDto,
  ) {
    return this.alertsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a saved search alert' })
  @ApiParam({ name: 'id', description: 'Alert id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.alertsService.remove(user.sub, id);
  }
}
