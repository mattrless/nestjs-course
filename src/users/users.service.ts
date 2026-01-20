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
      const newUser = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: body.password,
          profile: {
            create: {
              name: body.profile.name,
              lastName: body.profile.lastName,
              avatar: body.profile.avatar,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
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

  async findProfileByUserId(id: number) {
    const user = await this.findOne(id);
    return user.profile;
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
