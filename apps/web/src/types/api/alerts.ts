/** Matches NestJS AlertResponseDto (GET/POST/PATCH /api/v1/alerts). */
export interface AlertDto {
  id: string;
  name: string;
  /** Opaque saved-search filter JSON — see AlertFilters in the backend's alert-filter-match.util. */
  filters: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertBody {
  name: string;
  filters: Record<string, unknown>;
}

export interface UpdateAlertBody {
  name?: string;
  filters?: Record<string, unknown>;
  isActive?: boolean;
}
