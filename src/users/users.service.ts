import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '../../generated/prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    const users = await this.prismaService.user.findMany();
    return users;
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
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const newUser = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          profile: {
            create: {
              name: body.profile.name,
              lastName: body.profile.lastName,
              avatar: body.profile.avatar,
            },
          },
        },
        include: { profile: true },
      });

      return newUser;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id },
        data: {
          email: body.email,
          password: body.password,

          profile: body.profile
            ? {
                update: {
                  name: body.profile.name,
                  lastName: body.profile.lastName,
                  avatar: body.profile.avatar,
                },
              }
            : undefined,
        },
        include: {
          profile: true,
        },
      });

      return updatedUser;
    } catch {
      throw new BadRequestException('Error updating user');
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prismaService.user.delete({
        where: { id },
      });
      return user;
    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findProfileByUserId(id: number) {
    const user = await this.findOne(id);
    return user.profile;
  }

  async findPostsByUserId(id: number) {
    const posts = await this.prismaService.post.findMany({
      where: {
        userId: id,
      },
    });

    return posts;
  }

  private async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
}
