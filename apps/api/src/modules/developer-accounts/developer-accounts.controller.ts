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
import { AdminCompoundDto } from '../compounds/mapper/compound.mapper';
import { AddDeveloperMemberDto } from './dto/add-developer-member.dto';
import { CreateDeveloperAccountDto } from './dto/create-developer-account.dto';
import { CreateMemberCompoundDto } from './dto/create-member-compound.dto';
import { UpdateDeveloperAccountDto } from './dto/update-developer-account.dto';
import { UpdateDeveloperMemberDto } from './dto/update-developer-member.dto';
import { UpdateMemberCompoundDto } from './dto/update-member-compound.dto';
import { DeveloperAccountsService } from './developer-accounts.service';
import {
  DeveloperAccountDto,
  DeveloperAccountMembershipDto,
  DeveloperMemberDto,
} from './mapper/developer-account.mapper';

@ApiTags('developer-accounts')
@ApiBearerAuth('access-token')
@Controller('developer-accounts')
export class DeveloperAccountsController {
  constructor(private readonly developerAccountsService: DeveloperAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a developer account (creator becomes OWNER)' })
  @ApiOkResponse({ type: DeveloperAccountDto })
  create(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateDeveloperAccountDto) {
    return this.developerAccountsService.create(user.sub, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'List developer accounts the current user is a member of' })
  @ApiOkResponse({ type: [DeveloperAccountMembershipDto] })
  listMine(@CurrentUser() user: AuthUserPayload) {
    return this.developerAccountsService.listMine(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a developer account (must be a member)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: DeveloperAccountDto })
  getById(@CurrentUser() user: AuthUserPayload, @Param('id', ParseIdPipe) id: string) {
    return this.developerAccountsService.getById(user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a developer account profile (OWNER/MANAGER members only)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: DeveloperAccountDto })
  update(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateDeveloperAccountDto,
  ) {
    return this.developerAccountsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a developer account (OWNER members only)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  remove(@CurrentUser() user: AuthUserPayload, @Param('id', ParseIdPipe) id: string) {
    return this.developerAccountsService.remove(user.sub, id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List developer account members (must be a member)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: [DeveloperMemberDto] })
  listMembers(@CurrentUser() user: AuthUserPayload, @Param('id', ParseIdPipe) id: string) {
    return this.developerAccountsService.listMembers(user.sub, id);
  }

  @Post(':id/members')
  @ApiOperation({
    summary: 'Add an existing registered user as a member (OWNER/MANAGER members only)',
  })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: DeveloperMemberDto })
  addMember(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: AddDeveloperMemberDto,
  ) {
    return this.developerAccountsService.addMember(user.sub, id, dto);
  }

  @Patch(':id/members/:memberId')
  @ApiOperation({ summary: "Change a member's role (OWNER members only)" })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiParam({ name: 'memberId', description: 'DeveloperMember id' })
  @ApiOkResponse({ type: DeveloperMemberDto })
  updateMemberRole(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('memberId', ParseIdPipe) memberId: string,
    @Body() dto: UpdateDeveloperMemberDto,
  ) {
    return this.developerAccountsService.updateMemberRole(user.sub, id, memberId, dto);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remove a member (OWNER/MANAGER members, or the member removing themselves)',
  })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiParam({ name: 'memberId', description: 'DeveloperMember id' })
  removeMember(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('memberId', ParseIdPipe) memberId: string,
  ) {
    return this.developerAccountsService.removeMember(user.sub, id, memberId);
  }

  @Get(':id/compounds')
  @ApiOperation({ summary: "List this developer account's compounds (must be a member)" })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: [AdminCompoundDto] })
  listCompounds(@CurrentUser() user: AuthUserPayload, @Param('id', ParseIdPipe) id: string) {
    return this.developerAccountsService.listCompounds(user.sub, id);
  }

  @Post(':id/compounds')
  @ApiOperation({ summary: 'Create a compound under this developer account (OWNER/MANAGER only)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiOkResponse({ type: AdminCompoundDto })
  createCompound(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: CreateMemberCompoundDto,
  ) {
    return this.developerAccountsService.createCompound(user.sub, id, dto);
  }

  @Patch(':id/compounds/:compoundId')
  @ApiOperation({ summary: 'Update a compound under this developer account (OWNER/MANAGER only)' })
  @ApiParam({ name: 'id', description: 'Developer id' })
  @ApiParam({ name: 'compoundId', description: 'Compound id' })
  @ApiOkResponse({ type: AdminCompoundDto })
  updateCompound(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', ParseIdPipe) id: string,
    @Param('compoundId', ParseIdPipe) compoundId: string,
    @Body() dto: UpdateMemberCompoundDto,
  ) {
    return this.developerAccountsService.updateCompound(user.sub, id, compoundId, dto);
  }
}
