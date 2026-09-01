import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminDashboardUsersStatsDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  active!: number;

  @ApiProperty()
  inactive!: number;

  @ApiProperty({ description: 'Users registered in the last 30 days' })
  recent!: number;
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

  @ApiProperty({ description: 'Properties created in the last 30 days' })
  recent!: number;
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
  followUp!: number;

  @ApiProperty()
  interested!: number;

  @ApiProperty()
  closed!: number;
}

export class AdminDashboardPortfolioDto {
  @ApiProperty()
  total!: number;

  @ApiProperty()
  published!: number;

  @ApiProperty()
  pendingReview!: number;

  @ApiProperty()
  rejected!: number;

  @ApiProperty()
  archived!: number;
}

export class AdminDashboardInventoryItemDto {
  @ApiProperty()
  propertyTypeId!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiProperty()
  count!: number;

  @ApiProperty({ example: 42.5 })
  percentage!: number;
}

export class AdminDashboardMonthlyRevenueDto {
  @ApiProperty({ example: '2025-01' })
  month!: string;

  @ApiProperty({ example: 100000 })
  revenue!: number;
}

export class AdminDashboardRevenueAnalyticsDto {
  @ApiProperty()
  totalRevenue!: number;

  @ApiProperty({ description: 'Successful payment revenue for the current calendar month' })
  currentMonthRevenue!: number;

  @ApiProperty({ type: [AdminDashboardMonthlyRevenueDto] })
  monthly!: AdminDashboardMonthlyRevenueDto[];
}

export class AdminDashboardExecutiveSummaryDto {
  @ApiProperty()
  totalProperties!: number;

  @ApiProperty()
  totalDevelopers!: number;

  @ApiProperty()
  totalCompounds!: number;

  @ApiProperty({ description: 'Leads created today' })
  leadsToday!: number;
}

export class AdminDashboardMonthlyCountDto {
  @ApiProperty({ example: '2025-01' })
  month!: string;

  @ApiProperty({ example: 42 })
  count!: number;
}

export class AdminDashboardPropertyGrowthDto {
  @ApiProperty({ type: [AdminDashboardMonthlyCountDto] })
  monthly!: AdminDashboardMonthlyCountDto[];
}

export class AdminDashboardTopDeveloperDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  logoUrl!: string | null;

  @ApiProperty()
  compoundCount!: number;

  @ApiProperty()
  publishedPropertyCount!: number;

  @ApiProperty()
  totalPropertyCount!: number;
}

export class AdminDashboardTopCompoundDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nameEn!: string;

  @ApiPropertyOptional({ nullable: true })
  nameAr!: string | null;

  @ApiPropertyOptional({ nullable: true })
  developerName!: string | null;

  @ApiProperty()
  publishedPropertyCount!: number;

  @ApiProperty()
  totalListings!: number;

  @ApiPropertyOptional({ nullable: true })
  locationName!: string | null;
}

export class AdminDashboardRecentLeadDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerName!: string;

  @ApiProperty()
  propertyTitle!: string;

  @ApiProperty({ example: 'INTERESTED' })
  status!: string;

  @ApiProperty({ example: 'مهتم' })
  statusLabel!: string;

  @ApiProperty()
  createdAt!: string;
}

export class AdminDashboardLeadFunnelStageDto {
  @ApiProperty({ example: 'NEW' })
  status!: string;

  @ApiProperty({ example: 'جديد' })
  label!: string;

  @ApiProperty()
  count!: number;

  @ApiProperty({ example: 25.5 })
  conversionPercentage!: number;
}

export class AdminDashboardLeadsIntelligenceDto {
  @ApiProperty()
  total!: number;

  @ApiProperty({ example: 26.4, description: 'Closed leads as percentage of total leads' })
  conversionRate!: number;

  @ApiProperty({ type: [AdminDashboardLeadFunnelStageDto] })
  funnel!: AdminDashboardLeadFunnelStageDto[];
}

export class AdminDashboardModerationDto {
  @ApiProperty()
  pendingProperties!: number;

  @ApiProperty()
  pendingPayments!: number;

  @ApiProperty()
  newLeads!: number;
}

export class AdminDashboardActivityItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'property_status' })
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  createdAt!: string;
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

  @ApiProperty({ type: AdminDashboardPortfolioDto })
  portfolio!: AdminDashboardPortfolioDto;

  @ApiProperty({ type: [AdminDashboardInventoryItemDto] })
  inventory!: AdminDashboardInventoryItemDto[];

  @ApiProperty({ type: AdminDashboardRevenueAnalyticsDto })
  revenue!: AdminDashboardRevenueAnalyticsDto;

  @ApiProperty({ type: [AdminDashboardTopDeveloperDto] })
  developers!: AdminDashboardTopDeveloperDto[];

  @ApiProperty({ type: [AdminDashboardTopCompoundDto] })
  compounds!: AdminDashboardTopCompoundDto[];

  @ApiProperty({ type: AdminDashboardLeadsIntelligenceDto })
  leadsIntelligence!: AdminDashboardLeadsIntelligenceDto;

  @ApiProperty({ type: AdminDashboardModerationDto })
  moderation!: AdminDashboardModerationDto;

  @ApiProperty({ type: AdminDashboardExecutiveSummaryDto })
  executive!: AdminDashboardExecutiveSummaryDto;

  @ApiProperty({ type: AdminDashboardPropertyGrowthDto })
  propertyGrowth!: AdminDashboardPropertyGrowthDto;

  @ApiProperty({ type: [AdminDashboardRecentLeadDto] })
  recentLeads!: AdminDashboardRecentLeadDto[];

  @ApiProperty({ type: [AdminDashboardActivityItemDto] })
  activity!: AdminDashboardActivityItemDto[];
}
