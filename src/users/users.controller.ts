import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'Charles Doe', email: 'charles@example.com' },
  ];

  @Get()
  getAll() {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    const user = this.users.find((u) => u.id === parseInt(id));

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (user.id === 1) {
      throw new ForbiddenException('Not allowed to access this user.');
    }

    return user;
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    const newUser: User = {
      ...body,
      id: this.users.sort((a, b) => b.id - a.id)[0].id + 1, // greater id + 1
    };

    this.users.push(newUser);

    return newUser;
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      return {
        message: 'User not found.',
      };
    }

    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      ...body,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    // delete with splice
    const userIndex = this.users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      return {
        message: 'User not found.',
      };
    }
    this.users.splice(userIndex, 1);

    //delete with filter
    // this.users = this.users.filter((u) => u.id !== parseInt(id));

    return {
      message: 'User deleted.',
    };
  }
}
// SUBIR A REPO POR PASOS
