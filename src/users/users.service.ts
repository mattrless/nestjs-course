import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    { id: 3, name: 'Charles Doe', email: 'charles@example.com' },
  ];

  findAll() {
    return this.users;
  }

  findUserById(id: string) {
    const userIndex = this.getUserIndexById(id);
    const user = this.users[userIndex];

    if (user.id === 1) {
      throw new ForbiddenException('Not allowed to access this user.');
    }

    return user;
  }

  createUser(body: CreateUserDto) {
    const newUser: User = {
      ...body,
      id: this.users.sort((a, b) => b.id - a.id)[0].id + 1, // greater id + 1
    };

    this.users.push(newUser);

    return newUser;
  }

  updateUser(id: string, body: UpdateUserDto) {
    const userIndex = this.getUserIndexById(id);

    const user = this.users[userIndex];
    const updatedUser = {
      ...user,
      ...body,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  deleteUser(id: string) {
    // delete with splice
    const userIndex = this.getUserIndexById(id);

    this.users.splice(userIndex, 1);

    //delete with filter
    // this.users = this.users.filter((u) => u.id !== parseInt(id));

    return {
      message: 'User deleted.',
    };
  }

  private getUserIndexById(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
      throw new NotFoundException('User not found.');
    }
    return userIndex;
  }
}
