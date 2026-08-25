import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators/current-user.decorator';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import {
  IncompleteSubmitResponseDto,
  PropertyCompletionDto,
} from '../dto/submit-property.dto';
import { PropertyResponseDto } from '../mapper/property.mapper';
import { PropertySubmitService } from '../services/property-submit.service';

@ApiTags('properties')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertySubmitController {
  constructor(private readonly propertySubmitService: PropertySubmitService) {}

  @Get('me/:id/completion')
  @ApiOperation({ summary: 'Check draft property submit completion' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyCompletionDto })
  getCompletion(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.propertySubmitService.getCompletion(user.sub, id);
  }

  @Post('me/:id/submit')
  @ApiOperation({ summary: 'Submit a complete draft property for review' })
  @ApiParam({ name: 'id', description: 'Property id' })
  @ApiOkResponse({ type: PropertyResponseDto })
  async submit(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PropertyResponseDto | IncompleteSubmitResponseDto> {
    const result = await this.propertySubmitService.submit(user.sub, id);

    if (!result.ok) {
      res.status(HttpStatus.BAD_REQUEST);
      return {
        success: false,
        missingFields: result.missingFields,
      };
    }

    return result.property;
  }
}
