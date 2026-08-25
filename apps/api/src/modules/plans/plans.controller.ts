import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { PlanResponseDto } from './mapper/plan.mapper';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Public()
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List active property listing plans' })
  @ApiOkResponse({ type: [PlanResponseDto] })
  list() {
    return this.plansService.listActive();
  }
}
