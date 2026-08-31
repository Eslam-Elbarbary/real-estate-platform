import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { AdminPaymentsService } from '../admin-payments.service';
import { ListAdminPaymentsQueryDto } from '../dto/list-admin-payments-query.dto';
import { AdminPaymentDto } from '../mapper/admin-payment.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/payments')
@Roles(RoleCode.ADMIN)
export class AdminPaymentsController {
  constructor(private readonly adminPaymentsService: AdminPaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List payments for admin management' })
  @ApiOkResponse({ type: [AdminPaymentDto] })
  async listPayments(
    @Query() query: ListAdminPaymentsQueryDto,
    @Req() req: Request,
  ) {
    const result = await this.adminPaymentsService.listPayments(query);
    return buildSuccessResponse<AdminPaymentDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment details for admin management' })
  @ApiOkResponse({ type: AdminPaymentDto })
  getPaymentDetails(
    @Param('id', ParseIdPipe) id: string,
  ): Promise<AdminPaymentDto> {
    return this.adminPaymentsService.getPaymentDetails(id);
  }
}
