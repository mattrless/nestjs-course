import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.user.findMany();
  }

  async findUserById(id: number) {
    const user = await this.findOne(id);

    if (user.id === 1) {
      throw new ForbiddenException('Not allowed to access this user.');
    }

    return user;
  }

  async createUser(body: CreateUserDto) {
    try {
      const newUser = await this.prismaService.user.create({
        data: body,
      });

      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: id,
      },
      data: body,
    });

    return updatedUser;
  }

  async deleteUser(id: number) {
    const deletedUser = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });

    if (!deletedUser) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return deletedUser;
  }

  private async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
