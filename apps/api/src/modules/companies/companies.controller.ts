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
import { CompaniesService } from './companies.service';
import { AddCompanyMemberDto } from './dto/add-company-member.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyMemberDto } from './dto/update-company-member.dto';
import {
  CompanyDto,
  CompanyMemberDto,
  CompanyMembershipDto,
} from './mapper/company.mapper';

@ApiTags('companies')
@ApiBearerAuth('access-token')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a company (creator becomes OWNER)' })
  @ApiOkResponse({ type: CompanyDto })
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(user.sub, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'List companies the current user is a member of' })
  @ApiOkResponse({ type: [CompanyMembershipDto] })
  listMine(@CurrentUser() user: AuthUserPayload) {
    return this.companiesService.listMine(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company (must be a member)' })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiOkResponse({ type: CompanyDto })
  getById(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.companiesService.getById(user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company profile (OWNER/ADMIN members only)' })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiOkResponse({ type: CompanyDto })
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a company (OWNER members only)' })
  @ApiParam({ name: 'id', description: 'Company id' })
  remove(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.companiesService.remove(user.sub, id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List company members (must be a member)' })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiOkResponse({ type: [CompanyMemberDto] })
  listMembers(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
  ) {
    return this.companiesService.listMembers(user.sub, id);
  }

  @Post(':id/members')
  @ApiOperation({
    summary: 'Add an existing registered user as a member (OWNER/ADMIN members only)',
  })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiOkResponse({ type: CompanyMemberDto })
  addMember(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: AddCompanyMemberDto,
  ) {
    return this.companiesService.addMember(user.sub, id, dto);
  }

  @Patch(':id/members/:memberId')
  @ApiOperation({ summary: "Change a member's role (OWNER members only)" })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiParam({ name: 'memberId', description: 'CompanyMember id' })
  @ApiOkResponse({ type: CompanyMemberDto })
  updateMemberRole(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('memberId', ParseIdPipe) memberId: string,
    @Body() dto: UpdateCompanyMemberDto,
  ) {
    return this.companiesService.updateMemberRole(user.sub, id, memberId, dto);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove a member (OWNER/ADMIN members, or the member removing themselves)',
  })
  @ApiParam({ name: 'id', description: 'Company id' })
  @ApiParam({ name: 'memberId', description: 'CompanyMember id' })
  removeMember(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('memberId', ParseIdPipe) memberId: string,
  ) {
    return this.companiesService.removeMember(user.sub, id, memberId);
  }
}
