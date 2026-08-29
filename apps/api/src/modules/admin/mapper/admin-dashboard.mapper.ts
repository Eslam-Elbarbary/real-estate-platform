import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardUsersStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  active!: number;

  @ApiProperty()
  inactive!: number;
}

export class AdminDashboardPropertiesStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  draft!: number;

  @ApiProperty()
  pendingReview!: number;

  @ApiProperty()
  published!: number;

  @ApiProperty()
  rejected!: number;

  @ApiProperty()
  archived!: number;

  @ApiProperty()
  expired!: number;
}

export class AdminDashboardSubscriptionsStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  active!: number;
}

export class AdminDashboardPaymentsStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  successful!: number;

  @ApiProperty()
  pending!: number;

  @ApiProperty()
  failed!: number;

  @ApiProperty()
  totalRevenue!: number;
}

export class AdminDashboardLeadsStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  new!: number;

  @ApiProperty()
  contacted!: number;

  @ApiProperty()
  interested!: number;

  @ApiProperty()
  closed!: number;
}

export class AdminDashboardStatsDto {
  @ApiProperty({ type: AdminDashboardUsersStatsDto })
  users!: AdminDashboardUsersStatsDto;

  @ApiProperty({ type: AdminDashboardPropertiesStatsDto })
  properties!: AdminDashboardPropertiesStatsDto;

  @ApiProperty({ type: AdminDashboardSubscriptionsStatsDto })
  subscriptions!: AdminDashboardSubscriptionsStatsDto;

  @ApiProperty({ type: AdminDashboardPaymentsStatsDto })
  payments!: AdminDashboardPaymentsStatsDto;

  @ApiProperty({ type: AdminDashboardLeadsStatsDto })
  leads!: AdminDashboardLeadsStatsDto;
}
