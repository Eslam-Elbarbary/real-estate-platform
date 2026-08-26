import { Controller, Get, Param, Post } from '@nestjs/common';
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
import { PaymentResponseDto } from './mapper/payment.mapper';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@Controller('subscriptions')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id/pay')
  @ApiOperation({ summary: 'Pay a pending subscription' })
  @ApiParam({ name: 'id', description: 'Subscription id' })
  @ApiCreatedResponse({ type: PaymentResponseDto })
  pay(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.paymentsService.paySubscription(user.sub, id);
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'List payments for a subscription' })
  @ApiParam({ name: 'id', description: 'Subscription id' })
  @ApiOkResponse({ type: [PaymentResponseDto] })
  list(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.paymentsService.listForSubscription(user.sub, id);
  }
}
