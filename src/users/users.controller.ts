import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  NotFoundException,
  ValidationPipe,
  UseGuards,
  HttpCode,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../schemas/user.schema';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
@SerializeOptions({ excludePrefixes: ['_'] })
export class UsersController {
  private logger = new Logger();
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    this.logger.debug(createUserDto);

    return await this.usersService.create(createUserDto);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuardJwt)
  @Get(':id')
  async findOne(@Param('id') id: number | string): Promise<User> {
    const user = await this.usersService.findUser(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  // @UseGuards(AuthGuardJwt)
  // @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    const user = await this.usersService.findUser(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return await this.usersService.update({
      _id: id,
      updateUserDto: input,
    });
  }

  // @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.usersService.remove(id);

    if (result?.deletedCount !== 1) {
      throw new NotFoundException('Nothing have been remove in the database');
    }

    return;
  }
}
