import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Optional bootstrap fields for a new draft.
 * ownerId and slug are never accepted from the client.
 */
export class CreateDraftDto {
  @ApiPropertyOptional({ example: 'Bright apartment in Nasr City' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}
