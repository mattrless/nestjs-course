import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ description: 'id of post' })
  id: number;

  @ApiProperty({ description: 'title of post' })
  title: string;

  @ApiProperty({ required: false, nullable: true })
  content?: string;

  @ApiProperty({ required: false, nullable: true })
  coverImage?: string;

  @ApiProperty({ required: false, nullable: true })
  summary?: string;

  @ApiProperty()
  isDraft: boolean;

  @ApiProperty()
  userId: number;

  // @ApiProperty({ type: () => UserResponseDto })
  // user: UserResponseDto;

  // @ApiProperty({ type: () => [CategoryResponseDto] })
  // categories: CategoryResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
