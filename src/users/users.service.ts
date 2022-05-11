import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Connection, Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDoc } from '../schemas/user.schema';

type userInput = {
  _id: string;
  updateUserDto: UpdateUserDto;
};

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDoc>,
    @InjectConnection()
    private readonly userConnection: Connection,
    private readonly authService: AuthService,
  ) {}

  async create(@Body() input: CreateUserDto): Promise<User> {
    const user = new User();

    if (input.password !== input.retypePassword) {
      throw new BadRequestException("The provides password doesn't match");
    }

    const isExist = await this.userModel.findOne({
      $or: [{ username: input.username }, { email: input.email }],
    });

    if (isExist) {
      this.logger.debug(isExist);
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    //need to implement return token
    user.username = input.username;
    user.password = await this.authService.hashPassword(input.password);
    user.email = input.email;

    return {
      ...new this.userModel(user).save(),
      token: this.authService.getTokenForUser(user),
    };
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find({}, { __v: 0 }).exec();
  }

  async findUser(_id: number | string): Promise<User | undefined> {
    const query = this.userModel.where('id');

    return query.findOne({}, { __v: 0 });
  }

  async update({ _id, updateUserDto }: userInput): Promise<UpdateResult> {
    return await this.userModel.updateOne({ _id: _id }, updateUserDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userModel.deleteOne({ _id: id });
  }
}
