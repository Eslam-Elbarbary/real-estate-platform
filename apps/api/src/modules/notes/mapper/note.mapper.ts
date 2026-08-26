import { ApiProperty } from '@nestjs/swagger';
import { PropertyNote } from '@prisma/client';

export class NoteResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  propertyId!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export function toNoteResponse(note: PropertyNote): NoteResponseDto {
  return {
    id: note.id,
    propertyId: note.propertyId,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}
