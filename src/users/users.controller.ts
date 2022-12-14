import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Expanse, Prisma, User } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
} from 'src/authentication/create-user.dto';
import { ExcludeNullInterceptor } from 'src/NonNullInterceptor';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @UseInterceptors(NotFoundInterceptor)
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser({ id: Number(id) });
  }

  @Post()
  @UseInterceptors(ExcludeNullInterceptor)
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    if (user === undefined) {
      throw new HttpException('No info provided', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.createUser(user);
  }

  @Patch(':id')
  @UseInterceptors(NotFoundInterceptor)
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: Prisma.UserWhereUniqueInput,
    @Body() user: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser({
      where: {
        id: Number(id),
      },
      data: user,
    });
  }

  @Delete(':id')
  @UseInterceptors(NotFoundInterceptor)
  async deleteUser(@Param('id') id: number): Promise<User> {
    return this.usersService.deleteUser({ id: Number(id) });
  }

  @Get(':id/expanses')
  @UseInterceptors(NotFoundInterceptor)
  async getUserExpanses(
    @Param('id') id: string,
  ): Promise<{ expanses: Expanse[] }> {
    const expanses = await this.usersService.getUserExpanses({
      id: Number(id),
    });
    return expanses;
  }
}
