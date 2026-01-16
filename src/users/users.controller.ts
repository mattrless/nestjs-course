import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
