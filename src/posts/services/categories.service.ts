import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const categories = await this.prismaService.category.findMany();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
        },
      });
    } catch {
      throw new BadRequestException('Error creating category');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.category.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }
}
