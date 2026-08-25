import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators';
import type { AuthUserPayload } from '../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionResponseDto } from './mapper/subscription.mapper';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@ApiBearerAuth('access-token')
@Controller('properties')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('me/:id/subscription')
  @ApiOperation({ summary: 'Select an active plan for a property listing' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiCreatedResponse({ type: SubscriptionResponseDto })
  create(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createForProperty(
      user.sub,
      id,
      dto.planId,
    );
  }

  @Get('me/:id/subscription')
  @ApiOperation({ summary: 'Get the current subscription for a property' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: SubscriptionResponseDto })
  get(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.subscriptionsService.getForProperty(user.sub, id);
  }
}
