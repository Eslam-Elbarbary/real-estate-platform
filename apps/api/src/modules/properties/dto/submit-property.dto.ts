import { ApiProperty } from '@nestjs/swagger';

/**
 * Submit has no request body — owner and property id come from JWT + route.
 * These DTOs describe completion and incomplete-submit responses.
 */
export class PropertyCompletionDto {
  @ApiProperty()
  completed!: boolean;

  @ApiProperty({ example: 83, description: '0–100 completion progress' })
  progress!: number;

  @ApiProperty({
    type: [String],
    example: ['price', 'images'],
  })
  missingFields!: string[];
}

export class IncompleteSubmitResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({
    type: [String],
    example: ['title', 'price', 'images'],
  })
  missingFields!: string[];
}
