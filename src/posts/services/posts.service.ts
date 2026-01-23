import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PostsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const posts = await this.prismaService.post.findMany({
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    return posts;
  }

  async findOne(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: number) {
    try {
      return await this.prismaService.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          coverImage: createPostDto.coverImage,
          summary: createPostDto.summary,

          user: {
            connect: {
              id: userId,
            },
          },

          categories: createPostDto.categoryIds
            ? {
                create: createPostDto.categoryIds.map((categoryId) => ({
                  category: {
                    connect: { id: categoryId },
                  },
                })),
              }
            : undefined,
        },

        include: {
          user: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    } catch {
      throw new BadRequestException('Error creating post');
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prismaService.post.update({
        where: { id },
        data: updatePostDto,
        include: {
          user: true,
        },
      });
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.post.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async findPostsByCategoryId(categoryId: number) {
    const posts = await this.prismaService.post.findMany({
      where: {
        categories: {
          some: {
            categoryId: categoryId,
          },
        },
      },
    });

    return posts;
  }
}
